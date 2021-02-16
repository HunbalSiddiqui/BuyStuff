var express = require('express')
var router = express.Router()
const { check, validationResult } = require('express-validator');

//get controller
const {signout,signup,signin,isSignedIn} = require('../controllers/auth')

router.post('/signup',[
    //Validation
    check('name').isLength({min : 3}).withMessage('Name must have atleast 3 characters.'),
    check('email').isEmail().withMessage('Email Must be provided.'),
    check('password').isLength({min : 5}).withMessage('Password should have atleast 5.'),

],signup)

router.post('/signin',[
    //Validation
    check('email').isEmail().withMessage('Email Must be provided.'),
    check('password').isLength({min : 5}).withMessage('Password must contain atleast 5 letters.'),
],signin)

router.get("/signout",signout)

router.get("/test", isSignedIn,(req,res)=>{
    // res.send("PROTECTED ROUTE!!!")
    res.json(req.authh)//name must be same i.e authh
})

module.exports  =   router;
