var express = require('express')
var router = express.Router()


var {getProductById,getProduct,createProduct,deleteProduct,updateProduct,getAllProducts,photo} = require('../controllers/product')
var {isSignedIn,isAdmin,isAuthenticated} = require('../controllers/auth')
var {getUserById} = require('../controllers/user')

//params
router.param('productId',getProductById)
router.param('userId',getUserById)

//routes
//will use form data because of files i.e iamges
//craete route
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin
,createProduct)
//read route
router.get('/products/get/:productId/',getProduct)
router.get('/products/photo/:productId/',photo)
//delete route
router.delete('/products/:productId/:userId',isSignedIn,isAuthenticated,
isAdmin,deleteProduct)
//update route
router.put('/products/:productId/:userId',isSignedIn,isAuthenticated,
isAdmin,updateProduct)
//listing route
router.get('/products/getAll',getAllProducts)
module.exports = router;