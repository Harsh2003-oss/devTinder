require("dotenv").config();//Load environment variables
const connectDB = require('./config/db')
connectDB();

const express = require('express');
const User = require("./models/User");

const app = express();

app.use(express.json())

app.post("/signup",async (req,res)=>{

    const user = new User(req.body)
console.log(user)
try {
    await user.save();
    res.send("Creatd success")
} catch (error) {
    res.send(error.message)
}
})

app.get('/user', async (req,res) => {
    
  const userEmail = req.body.emailID;

    try {
        const user = await User.findOne({emailID:userEmail})
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

app.listen(3000,()=>{
    console.log('server running successfully')
})