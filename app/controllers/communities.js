const { httpError } = require('../helpers/handleError')
const communitiesModel = require('../models/communities') // futuro uso con DB

let communities = [
    {
        "id": 1,
        "name": ".NET",
        "startDate": "2024-01-01",
        "status": "completed",
        "leader": { "name": "Erin Gonzales", "avatar": "assets/images/sellers/1.png" }
    },
    {
        "id": 2,
        "name": "WEB",
        "startDate": "2023-12-21",
        "status": "completed",
        "leader": { "name": "Darryl Day", "avatar": "assets/images/sellers/2.png" }
    },
];

/**
 * Obtener lista paginada de comunidades
 */
const getItems = async (req, res) => {
    try {
        // Query params para paginación
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit) || 10, 1)

        const total = communities.length
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = communities.slice(startIndex, endIndex)

        res.send({
            data: results,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: endIndex < total,
                hasPrev: startIndex > 0
            }
        })
    } catch (e) {
        httpError(res, e)
    }
}

/**
 * Obtener comunidad por ID
 */
const getItem = (req, res) => {
    try {
        const communityId = parseInt(req.params.id, 10)
        const community = communities.find(c => c.id === communityId)

        if (!community) {
            return res.status(404).send({ error: 'Comunidad no encontrada' })
        }

        res.send({ data: community })
    } catch (e) {
        httpError(res, e)
    }
}

/**
 * Crear nueva comunidad
 */
const createItem = (req, res) => {
    try {
        const { name, startDate, status, leader } = req.body
        if (!name || !startDate) {
            return res.status(400).send({ error: 'Faltan campos obligatorios' })
        }

        const newCommunity = {
            id: communities.length + 1,
            name,
            startDate,
            status: status || 'pending',
            leader: leader || {}
        }

        communities.push(newCommunity)
        res.status(201).send({ data: newCommunity })
    } catch (e) {
        httpError(res, e)
    }
}

/**
 * Actualizar comunidad
 */
const updateItem = (req, res) => {
    try {
        const communityId = parseInt(req.params.id, 10)
        const index = communities.findIndex(c => c.id === communityId)

        if (index === -1) {
            return res.status(404).send({ error: 'Comunidad no encontrada' })
        }

        communities[index] = {
            ...communities[index],
            ...req.body
        }

        res.send({ message: 'Comunidad actualizada', data: communities[index] })
    } catch (e) {
        httpError(res, e)
    }
}

/**
 * Eliminar comunidad
 */
const deleteItem = (req, res) => {
    try {
        const communityId = parseInt(req.params.id, 10)
        const index = communities.findIndex(c => c.id === communityId)

        if (index === -1) {
            return res.status(404).send({ error: 'Comunidad no encontrada' })
        }

        const deleted = communities.splice(index, 1)[0]
        res.send({ message: 'Comunidad eliminada', data: deleted })
    } catch (e) {
        httpError(res, e)
    }
}

module.exports = { getItem, getItems, createItem, updateItem, deleteItem }
