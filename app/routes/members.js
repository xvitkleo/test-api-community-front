const express = require('express')
const router = express.Router()
const { getItems, getItem, createItem, deleteItem, updateItem, addMultipleItems, updateMultipleItems } = require('../controllers/members')

router.get('/', getItems)

router.get('/:id', getItem)

router.post('/batch', addMultipleItems);  // agregar varios miembros
router.patch('/batch', updateMultipleItems); // actualizar estados a inactivo

//TODO: Donde recibimos data
router.post('/', createItem)

router.put('/:id', updateItem)

router.delete('/:id', deleteItem)



module.exports = router