const Order = require('../models/Order')


exports.getAllOrders = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page-1)*limit
        const orders = await Order.find().limit(limit).skip(skip)
        res.send(orders)
    } catch (error) {
        res.status(500).send()
    }
}


exports.getOrderById = async(req,res)=>{
    try {
        const id = req.params.id
        const order = await Order.findById(id)
        if(!order) {
            res.status(404).send({error:'This order does not exist.'})
        }
        res.send(order)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.deleteOrderById = async(req,res) => {
    try {
        const id = req.params.id
        const order = await Order.findByIdAndDelete(id)
        res.send(order)
    } catch (error) {
        res.status(500).send()
    }
}

exports.createOrder = async(req,res) => {
    try {
        const order = new Order(req.body)
        await order.save()
        res.status(201).send()
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