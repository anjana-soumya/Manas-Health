const express=require('express');
const sendMail = require('./sendOtp');
const User = require('../userModel');
const mongoose = require('mongoose');

const verify=express.Router();
const resendOTP=express.Router();
const changeEmail=express.Router();

verify.post('/', async (req,res)=>{
  userEnteredOTP=req.body.otp;
  console.log(req.session.otp);
  console.log(userEnteredOTP);
  if(userEnteredOTP===req.session.otp){
    console.log("verified");
    try{
      await mongoose.connect("mongodb://localhost:27017/manashealth");
      await User.create(req.session.userData);
      req.session.isAuth = true;
      req.session.category = req.session.userData.category;
      // req.session.cookie.maxAge = 86400000;
      console.log('User inserted successfully!');
    res.status(200).json({success: true});

    }finally{
      await mongoose.disconnect();
    }  
  }else{
    res.json({success:false, message:"wrong otp"});
  }
})

changeEmail.post('/', async (req,res)=>{
  try{
    const newEmail = req.body.email;
    await mongoose.connect("mongodb://localhost:27017/manashealth");
    const findUser = await User.findOne({email});
    if(findUser){
      return res.status(400).json({success:false, message:'account with the email already exists'});
    }
    req.session.userData.email = newEmail;
    console.log(req.session.userData);
    const otp = await sendMail.sendOTP(newEmail, req.session.userData.username);
    req.session.otp=otp;
    res.status(200).json({success: true});
  }catch{
    console.log("error sending otp");
    res.status(500).json({success:false, message:"error sending otp"});
  }
})

resendOTP.post('/', async (req,res)=>{
  try{
    const email = req.session.userData.email;
    const otp = await sendMail.sendOTP(email, req.session.userData.username);
    req.session.otp=otp;
    res.status(200).json({success: true});

  }catch{
    console.log("error resending otp");
    res.status(500).json({success:false, message:"error resending otp"});
  }
})

module.exports = {verify, changeEmail, resendOTP};