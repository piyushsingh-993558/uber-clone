const express=require('express');
const router=express.router();
 const {body}=require("express-validator");
 const userController=require('../controllers/user.controller');
router.post('/register',[
  body('email').isEmail().withMessage('Invalid Email'),
  body('fullname.firstname').isLength({min:3}).withMessage('First'),
 body('password').isLength({min:6}).withMessage('password must b')
],userController.registerUser);
module.exports=router;
