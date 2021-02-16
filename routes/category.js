var express = require('express')
var router = express.Router()
const { check, validationResult } = require('express-validator');

var {getCategoryById,createCategory,getCategory,getAllCategory,updateCategory,removeCategory} = require('../controllers/category')
var {isSignedIn,isAdmin,isAuthenticated} = require('../controllers/auth')
var {getUserById} = require('../controllers/user')
//params
router.param("userId",getUserById);
router.param("categoryId",getCategoryById)

//routes
//create
router.post("/category/create/:userId"
,check('name').isLength({min : 1}).withMessage('Category name must have atleast 1 character.')
,isSignedIn,isAuthenticated,isAdmin,createCategory)
//read
router.get("/category/:categoryId",getCategory)
router.get("/categories",getAllCategory)
//update
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory)
//delete
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,removeCategory)


module.exports = router;