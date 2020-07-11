var express = require('express')
var router = express.Router()

var {getUserById,getUser,updateUser,userPurchaseList} = require('../controllers/user');
var {isSignedIn,isAuthenticated,isAdmin} = require('../controllers/auth');

router.param('userId',getUserById)//taking id from url

//name of param should be same i.e userId
router.get('/user/:userId',isSignedIn,isAuthenticated,getUser)

router .put('/user/:userId ',isSignedIn,isAuthenticated,updateUser)
router .put('/orders/user/:userId ',isSignedIn,isAuthenticated,userPurchaseList)
// router.get('/users',getAllUsers)

module.exports = router
