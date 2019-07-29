var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

var getPassCat= passCatModel.find({});
var getAllPass= passModel.find({});
/* GET home page. */

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexitemail=userModule.findOne({username:uname});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Username Already Exit' });

 }
 next();
  });
}

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Email Already Exit' });

 }
 next();
  });
}

router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }else{
  res.render('index', { title: 'Password Management System', msg:'' });
  }
});

router.post('/', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec((err, data)=>{
   if(data==null){
    res.render('index', { title: 'Password Management System', msg:"Invalid Username and Password." });

   }else{
if(err) throw err;
var getUserID=data._id;
var getPassword=data.password;
if(bcrypt.compareSync(password,getPassword)){
  var token = jwt.sign({ userID: getUserID }, 'loginToken');
  localStorage.setItem('userToken', token);
  localStorage.setItem('loginUser', username);
  res.redirect('/dashboard');
}else{
  res.render('index', { title: 'Password Management System', msg:"Invalid Username and Password." });

}
   }
  });
 
});


router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }else{
  res.render('signup', { title: 'Password Management System', msg:'' });
  }
});
router.post('/signup',checkUsername,checkEmail,function(req, res, next) {
        var username=req.body.uname;
        var email=req.body.email;
        var password=req.body.password;
        var confpassword=req.body.confpassword;
  if(password !=confpassword){
    res.render('signup', { title: 'Password Management System', msg:'Password not matched!' });
   
  }else{
    password =bcrypt.hashSync(req.body.password,10);
        var userDetails=new userModule({
          username:username,
          email:email,
          password:password
        });
     userDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('signup', { title: 'Password Management System', msg:'User Registerd Successfully' });
     })  ;
    } 

  
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});
module.exports = router;
