const express = require('express')
const ordersController = require('../controllers/ordersController')
const router = express.Router()

router.get('/',ordersController.getAllOrders)

router.post('/',ordersController.createOrder)

router.get('/:id',ordersController.getOrderById)

router.delete('/:id',ordersController.deleteOrderById)

module.exports = router