var express = require('express')
var router = express.Router()


// const {isSignedIn,isAuthenticated} = require('../controllers/auth')
const {getToken,processPayment} = require('../controllers/paymentA')
const {isSignedIn,isAuthenticated} = require("../controllers/auth")
const {getUserById} = require('../controllers/user')

//params
router.param('userId',getUserById)//taking id from url


//create
router.post("/payment/braintree/:userId",isSignedIn,isAuthenticated,processPayment)
//get 
router.get("/payment/gettoken/:userId",isSignedIn,isAuthenticated,getToken)
module.exports = router
