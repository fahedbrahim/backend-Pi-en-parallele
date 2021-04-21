var express = require('express');
var router = express.Router();
const userModel = require('../../models/user')

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

router.get('/:id' ,verifAuth , async (req, res) => {
  var user = await userModel.findById(req.params.id)
  res.send(user);
});

router.put('/:id' ,verifAuth , async (req, res) => {
  var user = await userModel.findByIdAndUpdate(req.params.id, req.body,{}) 
  var user = await userModel.findById(req.params.id)
  res.send(user);
});

router.delete('/:id' ,verifAuth , async (req, res) => {
  var user = await userModel.findById(req.params.id)
  user.remove();
  res.send('user deleted')

});

router.post('/adduser',verifAuth, async (req,res)=>{
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
    await user.save();
    res.send(user);

  }catch(err){
    res.status(203).send(err.message)
  }
});


module.exports = router;
