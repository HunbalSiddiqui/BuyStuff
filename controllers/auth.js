const User = require('../models/user');
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
var expressJwt = require('express-jwt')
exports.signup = (req, res) =>{
    const errors = validationResult(req) 
    if(!errors.isEmpty())
    {
        return res.status(422).json({
            error : errors.array()[0].msg,
            param : errors.array()[0].param
        })
    }
    const user = new User(req.body)
    user.save((err, createdUser)=>{
        if(err)
        {
            //bad request error : 400
            return res.status(400).json({
                err:"NOT ABLE TO SAVE USER IN DB"
            })
        }
        return res.json({
            name : user.name,
            email : user.email,
            id : user._id
        })
    })
}


exports.signin = (req, res) =>{
    const {email,password} = req.body;
    const errors = validationResult(req.body)
    if(!errors.isEmpty())
    {
        return res.status(422).json({
            error : errors.array()[0].msg,
            param : errors.array()[0].param
        })
    }
    User.findOne({email},(err, user)=>{
        if(err||!user) 
        {
            return res.status(400).json({
                message : "USER DOES NOT EXIST"
            })
        }

        if(!user.authenticate(password))
        {
            return res.status(401).json({
                error : "Email and password do not match" 
            })
        }

        //if all clear than create token
        const token = jwt.sign({_id: user._id},process.env.SECRET)
        //put token in cookie
        res.cookie("token",token,{expire: new Date()+9999});
        //send response to frontend
        const {_id,name,email,role} = user;
        return res.json({
            token, user:{_id,name,email,role}
        })
    })
}


exports.signout = (req, res) =>{
    res.clearCookie("token")//because we have cookieParser middleware to use such methods
    res.json({
        message : "User Signout Successfully..."
    })  
}

//protected routes
exports.isSignedIn =   expressJwt({
     secret: process.env.SECRET, algorithms: ['HS256'] ,
     userProperty : "authh"//due to cookieparser, aauthh is put into req

         //we are not writing next in this middleware because we
    // have imported expressjwt middleware they had handled that part from their end...
    })


//custom middlewares

exports.isAuthenticated = (req,res,next)=>{
    let checker = req.profile && req.authh && req.profile._id == req.authh._id ;//dont put === cux it checks for same object
    if(!checker){
         return res.status(403)
         .json({error : "ACCESS DENIED"})
    }
    next();
} 

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role===0)
    {
        return res.status(403).json({
            error : "You are not an ADMIN, Access Denied"
        })
    }
    next();
} 
