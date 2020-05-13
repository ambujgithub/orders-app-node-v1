const mongoose = require('mongoose')
const Order = require('../models/Order')


const productSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        unique: true
    },
    ProductName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    ProductDescription: {
        type: String
    },
    unitPrice: {
        type: Number,
        required: true
    }
})

productSchema.virtual('orders', {
    ref: 'dbenvyload_order',
    localField: '_id',
    foreignField: 'lineItems.prodId'
})

productSchema.pre('deleteOne',async function(next) {
    const product = this
    const productId = product.getQuery()['_id']
    await Order.updateMany({'lineItems.prodId':productId},{$pull: {lineItems:{prodId: productId} }},{ multi: true })
    next()
})

const Product = mongoose.model('dbenvyload_product',productSchema)


module.exports = Product