var express = require('express');
var router = express.Router();
const userModel = require('../models/user')

const verifAuth = (req, res, next)=>{
  if(req.session.isAuth){
      next()
  }else{
      res.redirect('/auth')
  }
}

/* GET users listing. */
router.get('/' ,verifAuth , async (req, res) => {
  
  var users = await userModel.find()
  res.send(users);
});

module.exports = router;
