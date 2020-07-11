//order is complex

const mongoose = require("mongoose");

const {Schema,ObjectId} = mongoose.Schema;

var ProductCartSchema = mongoose.Schema({
    product : {
        type : ObjectId,
        ref : "Product",
    },
    name : String,
    count : Number,
    price : Number,

})

const ProductCart = mongoose.model("ProductCart",ProductCartSchema)

var orderSchema = mongoose.Schema({
    products : [ProductCartSchema],
    transaction_id : {},
    amount : {type : Number},
    address : String,
    updated : Date,
    user : {
        type : ObjectId,
        ref : "User"
    }
},{timestamps: true})


const Order = mongoose.model("Order",orderSchema)

module.exports = {Order,ProductCart}