// https://www.freeprojectz.com/nodejs/nodejs-project-order-management-system 

const express = require('express')
const PORT = process.env.PORT || 3000
require('./db/mongoose')
const mongoose = require('mongoose')
const ordersRouter = require('./routers/orders')
const customersRouter = require('./routers/customers')
const productsRouter = require('./routers/products')
const app = express()

app.use((req,res,next)=>{
    mongoose.set('debug',true)
    next()
})

app.use(express.json())
// app.use('/',async(req,res)=>{
//     res.send('Welcome to the orders API')
// })
app.use('/orders',ordersRouter)
app.use('/customers',customersRouter)
app.use('/products',productsRouter)


app.listen(PORT,()=>{
    console.log(`Server listening on PORT: ${PORT}`)
})