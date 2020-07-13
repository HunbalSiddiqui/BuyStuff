const mongoose = require('mongoose');

const {Schema,ObjectId} = mongoose.Schema;


var productSchema = mongoose.Schema({
    name : {
        type : String,required : true,
        trim : true,maxlength : 32
    },
    description : {
        type : String, required : true,
        trim : true,maxlength : 2000
    },
    price : {
        type : Number, trim : true,
        required : true,maxlength : 32 
    },
    category : {
        type : ObjectId,
        ref : "Category",
        require : true
    },
    stock : {
        type : Number
    },
    sold : {
        type : Number,
        default : 0
    },
    photo : {
        data : Buffer,
        contentType : String,
    }
},{timestamps : true})

module.exports = mongoose.model("Product", productSchema)