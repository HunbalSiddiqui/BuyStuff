const User = require('../models/user');
const Order = require('../models/order')
//custom middlewares
exports.getUserById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err||!user)
        {
        return res.status(400).json({error : "NO USER FOUND"})
        }
        req.profile = user; //creating a object of profile in req
        next();
    })
}
exports.pushOrderInPurchaseList = (req,res,next)=>{
    var purchases = [];
    // console.log("user purchase list ",req.body.order)
    req.body.order.products.forEach(product => {
        purchases.push({
            _id : product._id,
            name : product.name,
            description : product.discription,
            category : product.category,
            quantity : product.quantity,
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id 
        })
    });
    //store this in db
    User.findOneAndUpdate(
        //find through id
        {_id : req.profile._id},
        //update field
        {$push : {purchases : purchases}},
        //compulsory 
        {new : true},
        (err, purchases)=>{
            if(err){
                console.log("find one and update error :" ,err)
                return res.status(400)
                .json({error : "UNABLE TO SAVE PURCHASE LIST"})
            }
            next();
        }
    )
}
//not a middleware
exports.getUser = (req,res) =>{
    //remove salt and ency_password field
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
}


exports.updateUser = (req,res) =>{
    User.findByIdAndUpdate(
        //provided updation
        {_id : req.profile._id},
        {$set: req.body},
        //cumpolsory parameters
        {new : true, useFindAndModify : false},
        (err,user)=>{
            if(err||!user)
            {
            return res.status(400).json({error : "You are not authorized."})
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req,res)=>{
    //we are selecting the orders based on req.profile._id i.e by particular model
        Order.find({user: req.profile._id})
        .populate("user","_id name")
        .exec((err,order)=>{
            if(err)
            {
                return res.status(400)
                .json({error : "No Order in this account"})
            }
            return res.json(order)
        })
}
// exports.getAllUsers = async(req,res)=>{
//     var users = await User.find()
//     return res.json({
//         users
//     })

    //another method

    // User.find().exec((err,users)=>{
    //     if(err||!users)
    //     {
    //         return res.status(400).json({
    //             error : "NO USERS FOUND."
    //         })
    //     }
    //     res.json(users)
    // })
// }