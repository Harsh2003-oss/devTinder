require("dotenv").config();//Load environment variables
const connectDB = require('./config/db')
connectDB();

const express = require('express');
const User = require("./models/User");

const app = express();
const bcrypt = require('bcrypt')

const cookie = require('cookie')
var cookieParser = require('cookie-parser')

var jwt = require('jsonwebtoken');

const {validateSignUpData,validateLogin} = require('./utils/valdation')

app.use(express.json())

app.post("/signup",validateSignUpData, async (req,res)=>{

    const {password}= req.body;

    const hashedPassword = await bcrypt.hash(password,10)


    const user = new User({...req.body,password:hashedPassword})
console.log(user)
try {
    await user.save();
    res.send("Creatd success")
} catch (error) {
    res.send(error.message)
}
})

app.post('/login', validateLogin,async (req,res)=>{
    try {
        res.send("welcome to login")
    } catch (error) {
          res.send(error.message)
    }
})

app.get('/user', async (req,res) => {
    
  const userEmail = req.body.email;

    try {
        const user = await User.findOne({email:userEmail})
        res.send(user)
        console.log(user)
    } catch (error) {
        res.send(error.message)
    }


})

app.patch('/user/:id',async (req,res) => {
   const userId = req.params.id;
   const {firstName} = req.body;

   try {
    const user = await User.findByIdAndUpdate(userId,{
        firstName:firstName,
    //   new:true
    })

    res.send(user)
   } catch (error) {
    res.send(error.message)
   }


})


app.get('/feed', async (req,res) => {

 
    try{
   const user = await User.find({})
   res.send(user)

    }
    catch (error) {
        res.send(error.message)
    }
})

app.get('/profile', async (req,res) =>{

    try {
        const cokkie = "hasjdjhaidskljkldjopsjdinciapijdioshiakh";

        res.send(cokkie)


    } catch (error) {
          res.send(error.message)
    }

})

app.listen(3000,()=>{
    console.log('server running successfully')
})