var express = require("express");
var router = express.Router();
var nodemailer = require('nodemailer')
const userModel = require("../models/user");

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
        to: data.emailsend,
        subject : data.emailsend,
        html: "<h4>hello welcome</h4>"
    }

    transporter.sendMail(mailOptions, (err, data)=>{
        if (err){
            console.log('error')
        }else{
            console.log('email sent !!!')
        }
    })
}

router.get("/", async (req, res) => {
    const { email, emailsend, subject ,message } = req.body;
    const user = await userModel.findOne({ email: emailsend });

    if (!user) {
        //return res.send("vous n'etes pas enregistrer");
       return res.status(203).send("vous n'etes pas enregistrer")
     }
     else {
        mail(req.body)
        res.send('email sent')
     }

})

module.exports = router;