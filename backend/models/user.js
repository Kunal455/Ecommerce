const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    }
    ,

    email:{
        type:String,
        required:true,
        trim:true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },

    password:{
        type:String,
        required:true,
        minLength:6
    },

    role:{
        type:String,
        enum: ["customer", "admin"],
        default: "customer"
    },
},
{timestamps: true});


const User = mongoose.model("User", userSchema)
module.exports = User