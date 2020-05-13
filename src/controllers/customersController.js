const Customer = require('../models/Customer')
const fileHelper = require('../helpers/fileHelper')
const axios = require('axios')

exports.getAllCustomers = async(req,res)=>{
    const sort  = {}

    if(req.query.sortBy && req.query.orderBy){
        sort[req.query.sortBy]   = req.query.orderBy === 'desc' ? -1 : 1
    }

    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page-1)*limit
        const customers = await Customer.find().sort(sort).limit(limit).skip(skip)
        res.send(customers)
    } catch (error) {
        res.status(500).send()
    }
}

exports.getCustomerById = async(req,res)=>{
    try {
        const id = req.params.id
        const customer = await Customer.findById(id)
        if(!customer) {
            res.status(404).send({error:'This customer does not exist.'})
        }
        res.send(customer)
    } catch (error) {
        res.status(500).send(error)
    }
}


exports.getOrdersByCutomerId = async(req,res) => {
    try {
        const id = req.params.id
        const customer = await Customer.findOne({_id:id})
        await customer.populate({path:'orders'}).execPopulate()
        res.send({orders: customer.orders})
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.createCustomer = async(req,res) => {
    try {
        const customer = new Customer(req.body)
        await customer.save()
        res.status(201).send(customer)
    } catch (error) {
        if(error.errors) {
            const properties = Object.keys(error.errors);
            const errors = []
            properties.forEach(property=>errors.push(error.errors[property].message))
            res.status(400).send({errors})
        }
        res.status(400).send(error)
    }
}


exports.deleteCustomerById = async(req,res) => {
    try {
        const id = req.params.id
        const customer = await Customer.deleteOne({_id:id})
        if(!customer.deletedCount) {
            res.status(404).send()
        }
        res.send(customer)
    } catch (error) {
        res.status(500).send(error)
    }
}


exports.updateCustomerById = async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['CustomerName', 'customerDescription', 'Address']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const customer = await Customer.findOne({ _id: req.params.id})

        if (!customer) {
            return res.status(404).send()
        }
        updates.forEach((update) => customer[update] = req.body[update])
        await customer.save()
        res.send(customer)
        
    } catch (e) {
        res.status(400).send(e)
    }
}


exports.downloadExcel = async(req,res) => {
    const customersCount = await Customer.countDocuments()
    const limit = 1000
    const pages = Math.ceil(customersCount/limit)
    for (let index = 1; index <= pages; index++) {
        axios.get(`http://localhost:3000/customers?page=${index}&limit=${limit}`)
        .then((data)=>{
             fileHelper.writeBulkDataToFile(JSON.stringify(data.data),'customers.json',index)
        })
        .catch(e=>console.log(e))
    }
    
}

