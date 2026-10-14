const express=require('express');
const router=express.router();
 const {body}=require("express-validator");
 const userController=require('../controllers/user.controller');
router.post('/register',[
  body('email').isEmail().withMessage('Invalid Email'),
  body('fullname.firstname').isLength({min:3}).withMessage('First'),
 body('password').isLength({min:6}).withMessage('password must b')
],userController.registerUser);

router.post('/login',[
    body('email').isEmaail.withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be a 6 character long')

],
  userController.loginUser
);
module.exports=router;
