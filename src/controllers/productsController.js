const Product = require('../models/Product')

exports.getAllProducts = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page-1)*limit
        const products = await Product.find().skip(skip).limit(limit)
        res.send(products)
    } catch (error) {
        res.status(500).send()
    }
}


exports.getProductById = async(req,res)=>{
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        if(!product) {
            res.status(404).send({error:'This product does not exist.'})
        }
        res.send(product)
    } catch (error) {
        res.status(500).send(error)
    }
}


exports.getOrdersByProductId = async(req,res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        if(!product) {
            res.status(404).send({error: 'This product does not exist.'})
        }
        await product.populate('orders').execPopulate()
        res.send(product.orders)
    } catch (error) {
        res.status(500).send()
    }
    
    
}


exports.deleteProductById = async(req,res) => {
    try {
        const id = req.params.id
        const product = await Product.deleteOne({_id:id})
        if(!product.deletedCount) {
            res.status(404).send()
        }
        res.send(product)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.updateProductById = async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['ProductName', 'ProductDescription', 'unitPrice']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const product = await Product.findOne({ _id: req.params.id})

        if (!product) {
            return res.status(404).send()
        }
        updates.forEach((update) => product[update] = req.body[update])
        await product.save()
        res.send(product)
        
    } catch (e) {
        res.status(400).send(e)
    }
}


exports.createProduct = async(req,res) => {
    const product = new Product(req.body)
    try {
        await product.save()
        res.status(201).send(product)
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