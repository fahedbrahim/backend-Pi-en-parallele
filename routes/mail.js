var express = require("express");
var router = express.Router();
var nodemailer = require('nodemailer')


const mail = (data)=>{

    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.MAILADRESS,
            pass : process.env.PASSMAIL
        }
    })

    let mailOptions = {
        from : process.env.MAILADRESS,
        to: data.email,
        subject : data.emailsend,
        text: data.message
    }

    transporter.sendMail(mailOptions, (err, data)=>{
        if (err){
            console.log('error')
        }else{
            console.log('email sent !!!')
        }
    })
}

router.get("/",  (req, res) => {

/*let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.MAILADRESS,
        pass : process.env.PASSMAIL
    }
})

let mailOptions = {
    from : 'wecodeesprit@gmail.com',
    to: 'fahed.brahim@esprit.tn',
    subject : 'test',
    text: 'test 1'
}

transporter.sendMail(mailOptions, (err, data)=>{
    if (err){
        console.log('error')
    }else{
        console.log('email sent !!!')
    }
})*/

mail(req.body)
res.send('ok')
})

module.exports = router;