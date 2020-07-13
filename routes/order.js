var express = require('express')
var router = express.Router()

var {getOrderById,createOrder,getAllOrders,updateStatus,getOrderStatus} = require('../controllers/order')
var {isSignedIn,isAdmin,isAuthenticated} = require('../controllers/auth')
var {getUserById,pushOrderInPurchaseList} = require('../controllers/user')
var {updateStock} = require('../controllers/product')
//params
router.param("userId",getUserById);
router.param("orderId",getOrderById);

//routes

//create
router.post("/order/create/:userId",isSignedIn,isAuthenticated,
pushOrderInPurchaseList,updateStock,createOrder)
//read
router.get('/order/all/:userId',isSignedIn,isAuthenticated,isAdmin,getAllOrders)
//status of order
router.get('/order/status/:userId',isSignedIn,isAuthenticated
,isAdmin,getOrderStatus)
router.put('/order/:orderId/status/:userId'
,isSignedIn,isAuthenticated,isAdmin,updateStatus)
module.exports = router