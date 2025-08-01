const express = require('express');
const router = express.Router();
const communitiesController = require('../controllers/communities');
const membersController = require('../controllers/members');

router.get('/', communitiesController.getItems);
router.get('/:id', communitiesController.getItem);
router.post('/', communitiesController.createItem);
router.put('/:id', communitiesController.updateItem);
router.delete('/:id', communitiesController.deleteItem);

// 🔹 Miembros de una comunidad con paginación
router.get('/:id/members', membersController.getByCommunity);

module.exports = router;
