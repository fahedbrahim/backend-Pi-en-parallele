var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')
const compwaitModel = require('../../models/compwaiting')
const userModel = require('../../models/user')

const verifAuth = (req, res, next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/auth')
    }
  }

  router.get('/' ,verifAuth , async (req, res) => {
  
    var companies = await compwaitModel.find()
    res.send(companies);
  });

  router.delete('/:id' ,verifAuth , async (req, res) => {
    var company = await compwaitModel.findById(req.params.id)
    company.remove().then(result=>{
        let transporter = nodemailer.createTransport({
          service : 'gmail',
          auth : {
              user : process.env.MAILADRESS,
              pass : process.env.PASSMAIL
          }
      })
  
        transporter.sendMail({
          to : company.email,
          from : process.env.MAILADRESS,
          subject : "Request canceled",
          html : `
          <p>Hello,</p>
          <h4>We are sorry, your request to create an account has been canceled because the contact details are not correct.</h4>
          `
        })
        res.send("company deleted")
      })
  
  });

  router.post('/add',verifAuth, async (req,res)=>{
    var company = await compwaitModel.findOne({email : req.body.email})
    const { username, email, password, adresse, phone, role,id_company } = req.body;
    user = new userModel({
      username,
      email,
      password,
      adresse,
      phone,
      role,
      id_company
    });
    try{
      await user.save().then(result=>{
        let transporter = nodemailer.createTransport({
          service : 'gmail',
          auth : {
              user : process.env.MAILADRESS,
              pass : process.env.PASSMAIL
          }
      })
  
        transporter.sendMail({
          to : company.email,
          from : process.env.MAILADRESS,
          subject : "Request accepted",
          html : `
          <p>Hello,</p>
          <h4>Welcome to our platform, your request to create an account has been accepted, 
          if you have forgotten your password you can change it with this <a href="${process.env.URLCORS}/resetpassword">link</a>.</h4>
          `
        })
        res.send(user)
      });
      
      await company.remove()
    }catch(err){
      res.status(203).send(err.message)
    }
  });

  module.exports = router;