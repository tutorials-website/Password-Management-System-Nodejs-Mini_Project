var express = require('express');
const userModel =require('../modules/user');
const Bcrypt = require("bcryptjs");
var router = express.Router();

/* GET home page. */
function CheckEmail(req,res,next){
  
  var emailValidate=userModel.findOne({email:req.body.email});
  emailValidate.exec(function(err,data){
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System', msg: 'Email Already Exit!' });
 
       }else{
        next();
       }
      });


}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password Management System' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password Management System', msg:'' });
});

router.post('/signup', CheckEmail,function(req, res, next) {
 
var username= req.body.uname;
var email= req.body.email;
var password= req.body.password;
var confpassword= req.body.confpassword;
if(password != confpassword){
  res.render('signup', { title: 'Password Management System', msg: 'Password Not Matched!' });
}else{
var userDetails=new userModel({
  username: username,
	email: email,
    password: Bcrypt.hashSync(password, 10),
});

userDetails.save(function(err,doc){
  if(err) throw err;
  res.render('signup', { title: 'Password Management System', msg:'Account Registered Successfully' });
});
  
}
});

router.get('/passwordCategory', function(req, res, next) {
  res.render('password_category', { title: 'Password Management System' });
});

router.get('/add-new-category', function(req, res, next) {
  res.render('addNewCategory', { title: 'Password Management System' });
});

router.get('/add-new-password', function(req, res, next) {
  res.render('add-new-password', { title: 'Password Management System' });
});

router.get('/view-all-password', function(req, res, next) {
  res.render('view-all-password', { title: 'Password Management System' });
});
module.exports = router;
