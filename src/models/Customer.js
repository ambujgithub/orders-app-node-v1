const mongoose = require('mongoose')
const Order = require('../models/Order')

const customerSchema = new mongoose.Schema({
    _id: {
        type: Number,
        unique: true,
        required: true
    },
    CustomerName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    customerDescription: {
        type: String
    },
    Address: {
        type: String,
        required: true
    }
})

customerSchema.virtual('orders', {
    ref: 'dbenvyload_order',
    localField: '_id',
    foreignField: 'CustId'
})

customerSchema.pre('deleteOne',async function(next){
        const customer = this
        const customerId = customer.getQuery()["_id"]
        await Order.deleteOne({CustId: customerId})
        next()
})

const Customer = mongoose.model('dbenvyload_customer',customerSchema)


module.exports = Customer