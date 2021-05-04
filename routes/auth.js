var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
var nodemailer = require('nodemailer')
const userModel = require("../models/user");
const compwaitModel = require("../models/compwaiting");

const verifAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/auth");
  }
};

router.post("/register", async (req, res) => {


  const { username, email, password, adresse, phone, role,id_company } = req.body;


  var user = await userModel.findOne({ email });
  var comp = await compwaitModel.findOne({ email });

  if (user || comp) {
    return res.status(203).send("il existe deja");
  }
  const hashedPsw = await bcrypt.hash(password, 12);
if (role === 'user' || role === 'deliveryMan'){
  user = new userModel({
    username,
    email,
    password: hashedPsw,
    adresse,
    phone,
    role,
    date : Date.now(),
    id_company
  });
  try{
    await user.save();
    res.send("user saved ");

  }catch(err){
    res.status(203).send(err.message)
  }
}

if(role === 'company'){
  company = new compwaitModel({
    username,
    email,
    password: hashedPsw,
    adresse,
    phone,
    role,
    date : Date.now(),
    id_company
  });
  try{
    await company.save().then(result=>{
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
        subject : "Account being processed",
        html : `
        <p>Thank you for joining our platform.</p>
        <h4>Your account is being processed for the moment, an email will be communicated to you upon acceptance</h4>
        `
      })
      res.send("your account is being processed, check your email")
    })
    
  }catch(err){
    res.status(203).send(err.message)
  }
}
});

router.get("/", async (req, res) => {
  res.status(203).send("you must login for enter");
});

router.post("/login", async (req, res) => {
  
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
     //return res.send("vous n'etes pas enregistrer");
    return res.status(203).send("vous n'etes pas enregistrer")
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(203).send("mot de passe incorrecte");
  }
  req.session.user = {id: user._id ,username : user.username, email: user.email, adresse: user.adresse, phone : user.phone, role: user.role, id_company: user.id_company};
  req.session.isAuth = true;
  req.session.compteur = 0;
  //res.redirect('/dashboard')
  //res.send('you are connected now')
  res.send(req.session.user);
});


router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    user = { role: "visiteur" };
    res.send(user);
  });
});

router.post("/reset-password",(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err)
    }
    const token = buffer.toString("hex")
    userModel.findOne({email : req.body.email}).then(user=>{
      if(!user){
        return res.status(203).send("user dont exists with that email")
      }
      user.resetToken = token
      user.expireToken = Date.now() + 60000
      user.save().then(result=>{
        let transporter = nodemailer.createTransport({
          service : 'gmail',
          auth : {
              user : process.env.MAILADRESS,
              pass : process.env.PASSMAIL
          }
      })
  
        transporter.sendMail({
          to : user.email,
          from : process.env.MAILADRESS,
          subject : "Password reset",
          html : `
          <p>You request for password reset</p>
          <h5>Click in this <a href="${process.env.URLCORS}/newpassword/${token}">link</a> to reset password</h5>
          `
        })
        res.send("check your email")
      })
    })
  })
});


router.post('/new-password',(req,res)=>{

    const newPassword = req.body.password
    const sentToken = req.body.token
    userModel.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}}).then(user=>{
      if(!user){
        return res.status(203).send("Try again session expired")
    }

    bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
            return res.send("password updated success")
           })
    })
    })
})


module.exports = router;
