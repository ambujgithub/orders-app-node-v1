const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        unique: true
    },
    CustId: {
        type: Number,
        required: true,
        ref: 'dbenvyload_customer'
    },
    orderStatus: {
        type: String
    },
    statusDate: {
        type: Date
    },
    lineItems: [{
        prodId: {
            type: Number,
            required: true,
            ref: 'dbenvyload_product'
        },
        prodCount: {
            default: 1,
            type: Number
        },
        Cost: {
            required: true,
            type: String
        }
    }]
},{
    timestamps: {
        createdAt : 'invoiceDate'
    }
})

const Order = mongoose.model('dbenvyload_order',orderSchema)

module.exports = Order