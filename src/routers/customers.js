const express = require('express')
const customersController = require('../controllers/customersController')
const router = express.Router()

router.get('/',customersController.getAllCustomers)

router.post('/',customersController.createCustomer)

router.get('/:id',customersController.getCustomerById)

router.get('/:id/orders',customersController.getOrdersByCutomerId)

router.delete('/:id',customersController.deleteCustomerById)

router.patch('/:id',customersController.updateCustomerById)

router.post('/download',customersController.downloadExcel)

module.exports = router