const validator = require('validator')
const bcrypt = require('bcrypt');
const User = require('../models/User')


const validateSignUpData =async (req,res,next) =>{
    const {firstName,lastName,email} = req.body;

    try {
        
    
    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }

    else if(!validator.isEmail(email)){
        throw new Error("email not valid")
    }




    next();
}
catch (error) {
     res.send(error.message)   
    }
}

const validateLogin =async (req,res,next) => {
    
    const {email,password} = req.body;
    
    try {
        const user = await User.findOne({email:email})

        if(!user){
            throw new Error("user not found")
        }

const isPasswordValid =await bcrypt.compare(password, user.password)
console.log(password)
if(!isPasswordValid){
   throw new Error("Invalid Password")
}

    } catch (error) {
          res.send(error.message)   
    }

    next();
}

module.exports = {validateSignUpData,validateLogin}