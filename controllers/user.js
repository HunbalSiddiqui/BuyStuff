const User = require('../models/user');

//custom middlewares
exports.getUserById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err||!user)
        {
            return res.status(400).json({
                error : "NO USER WAS FOUND."
            })
        }
        req.profile = user //creating a object of profile in req
        next()
    })
}

exports.getUser = (req,res,next) =>{
    //TODO: get back here for password
    return res.json(req.profile)
}