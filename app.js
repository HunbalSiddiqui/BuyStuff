require('dotenv').config()

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//DB connection
mongoose.connect(process.env.DATABASE,{
useNewUrlParser: true,
useUnifiedTopology : true,
useCreateIndex : true,
useFindAndModify:false
})
.then(()=>{
    console.log("DB IS CONNECTED")
})
.catch((err)=>{
    console.log("DB FAILED TO CONNECT")
})


//middlewares
app.use(bodyParser.json())
app.use(cookieParser())//to put/delete values to the cookies
app.use(cors())

//Routes Section
//my routes
const authRoutes =  require('./routes/auth');
app.use('/api',authRoutes)//craete a route otherwise app will crash

const userRoutes = require('./routes/user')
app.use('/api',userRoutes)//craete a route otherwise app will crash


const categoryRoutes = require('./routes/category')
app.use('/api',categoryRoutes)//craete a route otherwise app will crash

const productRoutes = require('./routes/product')
app.use('/api',productRoutes)

const orderRoutes = require('./routes/order')
app.use('/api',orderRoutes)

//stripe rout
const stripeRoutes = require('./routes/stripePayment')
app.use('/api',stripeRoutes)
//paypal and all other card
const paymentARoutes = require('./routes/paymentA')
app.use('/api',paymentARoutes)
//Port
const port = process.env.PORT || 8000;
//Starting point of a server
app.listen(port,()=>{
    console.log('app is listening at 8000')
})

console.log(process.env)
// console.log(app.get('env'))