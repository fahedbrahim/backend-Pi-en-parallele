var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/user')


const verifAuth = (req, res, next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/auth')
    }
}

router.post('/register', async (req,res)=>{
    const {username, email, password,adresse,role} = req.body
    
    var user = await userModel.findOne({email})

    if (user){
        return res.send('il existe deja')
    }
    const hashedPsw = await bcrypt.hash(password, 12)
 
    user = new userModel({
        username,
        email,
        password : hashedPsw,
        adresse,
        role
    })

    await user.save()
   

    res.send('user enregistrer ')
})


router.get('/',async (req,res)=>{
    
    res.json("welcome in home you must login for enter")
 })


router.post('/login', async (req,res)=>{
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.send("vous n'etes pas enregistrer")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        return res.send('mot de passe incorrecte')
    }
    req.session.user = user
    req.session.isAuth = true
    req.session.compteur = 0
    //res.redirect('/dashboard')
    //res.send('you are connected now')
    res.send(req.session.user)

})

router.get('/dashboard',verifAuth,(req,res)=>{
    req.session.compteur +=1
    res.send('vous etes le bienvenue sur dashboard '+req.session.compteur)
})

router.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw(err)
        user = {role : "visiteur"}
        res.send(user)
    })
})

module.exports = router;