const Product = require('../models/product');
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')//defualt filesystem present in nodejs 
//middlewares
exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err)
        {
            return res.status(400).json({
                error : "NO PRODUCT FOUND."
            })
        }
        req.product = product
        next()
    })
}
//TODO: will be used in future
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next()
}
//TODO: will be used in future
exports.updateStock = (req,res,next)=>{
    let myOperations = req.body.order.products.map(product=>{
        return {
            updateOne : {
                filter : {_id:product._id},//finding the product through id. docs of bulkwrite
                update : {$inc : {stock: - product.count, sold: + product.count}}
            }
        }
    })
    Product.bulkWrite(
        myOperations,{},
        (err,products)=>{
            if(err)
            {
                return res.status(400)
                .json({error : "Bulk operations failed"})
            }
            next()
        })
}

//post
exports.createProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "Invalid File, please follow the mentioned restrictions."})
        }
        //destructure the fields
        var {name,description,price,category,stock} = fields;
        if(
            !name||
            !description||
            !price||
            !category||
            !stock
        ){
            return res.status(400)
            .json({error : "PLEASE INCLUDE ALL FIELDS."})
        }
        let product = new Product(fields);
        //handle file here
        if(file.photo)
        {
            console.log("issue is hereeee <------")
            if(file.photo.size>2097152)//3mb
            {
                return res.status(400)
                .json({error: "File sizee too big!"})
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to the DB
        product.save((err, product)=>{
            if(err)
            {
                res.status(400)
                .json({error:"Saving books in DB failed"})
            }
            return res.json(product)
        })
    })
}

//read
exports.getProduct = (req,res) =>{
    req.product.photo = undefined //to remove the bulk of photo
    //we will put up a middleware which will load the photo in the background
    return res.json(req.product)
}

//read
exports.deleteProduct = (req,res)=>{
    var product = req.product
    //since this is also an object from mongoose
    product.remove((err,removedProduct)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "Can not delete the product"})
        }
        return res.json({
            message : `Deleted this product = ${removedProduct}`
        })
    })
}

//update
exports.updateProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "Invalid File, please follow the mentioned restrictions."})
        }

        let product = req.product;
        //we can use the ... method to do this
        product = _.extend(product, fields)//these fields are gonna updated inside the product.

        //handle file here
        if(file.photo)
        {
            console.log("issue is hereeee <------")
            if(file.photo.size>2097152)//3mb
            {
                return res.status(400)
                .json({error: "File sizee too big!"})
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to the DB
        product.save((err, product)=>{
            if(err)
            {
                res.status(400)
                .json({error:"Updation of book failed."})
            }
            return res.json(product)
        })
    })
}

//product listing
exports.getAllProducts = (req, res)=>{
    //if there is query from the frontend and it has the property of limit
    let limit = req.query.limit ? parseInt(req.query.limit) :8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id" 
    //- sign in select means dont select
    Product.find()
    .select('-photo')
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "No product found."})
        }
        return res.json(products)
    })
}
