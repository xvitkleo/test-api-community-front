const { httpError } = require('../helpers/handleError');
const membersModel = require('../models/members');
const PORT = process.env.PORT || 3000;
const URL_PUBLIC = process.env.URL_PUBLIC || '/';

let members = [
  {
    id: 1,
    code: 1001,
    name: 'Erin Gonzales',
    communityId: 1,
    mentor: true,
    status: 'Activo',
    responsible: 'Erin Gonzales',
    project: 'Project A',
    technology: '.NET',
  },
  {
    id: 2,
    code: 1002,
    name: 'Darryl Day',
    communityId: 1,
    mentor: false,
    status: 'Activo',
    responsible: 'Darryl Day',
    project: 'Project A',
    technology: '.NET',
  },
  {
    id: 3,
    code: 1003,
    name: 'Marshall Nichols',
    communityId: 2,
    mentor: false,
    status: 'Activo',
    responsible: 'Marshall Nichols',
    project: 'Project B',
    technology: 'WEB',
  },
  {
    id: 4,
    code: 1004,
    name: 'Virgil Gonzales',
    communityId: 1,
    mentor: true,
    status: 'Activo',
  },
];

const getItems = async (req, res) => {
  try {
    if (!req.query.page || !req.query.limit) {
      res.send({
        data: members,
        total: members.length,
      });
    }
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = members.slice(startIndex, endIndex);

    res.send({
      data: results,
      total: members.length,
      page,
      limit,
    });
  } catch (e) {
    httpError(res, e);
  }
};

// GET /communities/:id/members → miembros de una comunidad con paginación
const getByCommunity = async (req, res) => {
  try {
    const communityId = parseInt(req.params.id, 10);
    if (isNaN(communityId)) {
      return res.status(400).send({ error: 'ID de comunidad inválido' });
    }

    const filtered = members.filter((m) => m.communityId === communityId);

    if (!req.query.page || !req.query.limit) {
      res.send({
        data: filtered,
        total: filtered.length,
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = filtered.slice(startIndex, endIndex);

    res.send({
      data: results,
      total: filtered.length,
      page,
      limit,
    });
  } catch (e) {
    httpError(res, e);
  }
};

const getItem = (req, res) => {
  try {
    const { id } = req.params;
    const memberId = parseInt(id, 10);

    const member = members.find((m) => m.id === memberId);
    if (!member) {
      return res.status(404).send({ error: 'Miembro no encontrado' });
    }

    res.send({ data: member });
  } catch (e) {
    httpError(res, e);
  }
};

const createItem = (req, res) => {
  try {
    const member = req.body;
    const newMember = {
      ...member,
      id: members.length + 1,
    };
    members.push(newMember);
    res.send({ data: newMember });
  } catch (e) {
    res.status(500).send({ error: 'Error al crear miembro' });
  }
};

const updateItem = (req, res) => {
  try {
    const { id } = req.params;
    const memberId = parseInt(id, 10);
    const updates = req.body;

    const index = members.findIndex((member) => member.id === memberId);
    console.log('Index encontrado:', index);
    if (index === -1) {
      return res.status(404).send({ error: 'Miembro no encontrado' });
    }

    // Actualizar solo los campos que vienen en el body
    members[index] = {
      ...members[index],
      ...updates,
    };
    console.log('Miembro actualizado:', members[index]);

    res.send({ message: 'Miembro actualizado', data: members[index] });
  } catch (e) {
    res.status(500).send({ error: 'Error al actualizar miembro' });
  }
};

const deleteItem = (req, res) => {
  try {
    const { id } = req.params;
    const memberId = parseInt(id, 10);
    const index = members.findIndex((member) => member.id === memberId);

    if (index === -1) {
      return res.status(404).send({ error: 'Miembro no encontrado' });
    }

    const deletedMember = members.splice(index, 1)[0]; // Eliminar y devolver el miembro eliminado

    res.send({ message: 'Miembro eliminado', data: deletedMember });
  } catch (e) {
    res.status(500).send({ error: 'Error al eliminar miembro' });
  }
};

const addMultipleItems = (req, res) => {
  try {
    const newMembers = req.body;
    if (!Array.isArray(newMembers) || newMembers.length === 0) {
      return res
        .status(400)
        .send({ error: 'Debe enviar un array de miembros' });
    }

    const added = newMembers.map((m) => ({
      ...m,
      id: members.length + 1 + members.indexOf(m),
    }));
    members = members.concat(added);

    res.send({ message: 'Miembros agregados', data: added });
  } catch (e) {
    res.status(500).send({ error: 'Error al agregar múltiples miembros' });
  }
};

const updateMultipleItems = (req, res) => {
  try {
    const updatesArray = req.body; // [{ id: 1, status: 'Inactivo' }, { id: 2, name: 'Nuevo nombre' }]
    if (!Array.isArray(updatesArray)) {
      return res
        .status(400)
        .send({ error: 'Se espera un array de miembros a actualizar' });
    }

    const updatedMembers = [];

    updatesArray.forEach((update) => {
      const memberId = parseInt(update.id, 10);
      const index = members.findIndex((member) => member.id === memberId);

      if (index !== -1) {
        members[index] = {
          ...members[index],
          ...update,
          id: members[index].id, // Evitar que se cambie el id
        };
        updatedMembers.push(members[index]);
      }
    });

    if (updatedMembers.length === 0) {
      return res
        .status(404)
        .send({ error: 'No se encontró ningún miembro para actualizar' });
    }

    res.send({ message: 'Miembros actualizados', data: updatedMembers });
  } catch (e) {
    res.status(500).send({ error: 'Error al actualizar miembros' });
  }
};

module.exports = {
  getItem,
  getItems,
  deleteItem,
  createItem,
  updateItem,
  getByCommunity,
  addMultipleItems,
  updateMultipleItems,
};
