const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true, /*required: [true, "Please add an email"],*/
        unique : true 
        /*match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
    unique: true,
  },*/
    },
    password : {
        type : String,
        required : true
    },
    adress : {
      type : String,
      required : true
    },
    phone : {
      type : String,
      required : true
    },
    role : {
      type : String,
      require : true
    },
    id_company : {
      type : String,
    }

    // role , date create , adresse 
    /*userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },*/
})

module.exports = mongoose.model('user', userSchema)