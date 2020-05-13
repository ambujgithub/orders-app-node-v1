const express = require('express')
const productsController = require('../controllers/productsController')
const router = express.Router()

router.post('/',productsController.createProduct)

router.get('/',productsController.getAllProducts)

router.get('/:id',productsController.getProductById)

router.get('/:id/orders',productsController.getOrdersByProductId)

router.delete('/:id',productsController.deleteProductById)

router.patch('/:id',productsController.updateProductById)

module.exports = router