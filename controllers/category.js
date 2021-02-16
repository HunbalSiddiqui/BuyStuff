const Category = require("../models/category")
const { check, validationResult } = require('express-validator');

//middleware
exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err)
        {
            return res.json({error : "Category not found"})
        }
        req.category = category;
    })
    next()
} 

//not middlewares
exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(422).json({
            error : errors.array()[0].msg,
            param : errors.array()[0].param
        })
    }
    category.save((err,category)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "NOT ABLE TO SAVE CATEGORY"})
        }
        res.json({category})
    })
}


exports.getCategory = (req,res) =>{
    return res.json(req.category)
}


exports.getAllCategory = (req,res) =>{
    Category.find().exec((err,categories)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "NO CATEGORIES FOUND"})
        }
        res.json(categories)
    })    
}

//update
exports.updateCategory = (req,res)=>{
    var category = req.category;
    console.log(req.body.name)
    console.log(req.category)
    category.name = req.body.name;
//we can category.save instead of Category.save because in getCategoryById we have got object from db
    category.save((err, updatedCategory)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "Failed to update category"})
        }
        res.json(updatedCategory)
    })
}

//delete
exports.removeCategory = (req,res)=>{
    const category = req.category;

    category.remove((err,removedCategory)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "Failed to remove category"})
        }
        res.json({
            message : `SUCCESSFULLY DELETED ${removedCategory}`
        })
    })
}