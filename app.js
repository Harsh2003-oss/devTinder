require("dotenv").config();//Load environment variables
const connectDB = require('./config/db')
const { buildSkillWeights } = require("./services/skillWeightService");

connectDB().then(async () => {
  await buildSkillWeights();
});

const express = require('express');
const cors = require('cors'); 
const User = require("./models/User");
const authRouter = require('./routes/auth')
const profileRouter = require("./routes/profile")
const requestRouter = require('./routes/requests')
const userRouter = require('./routes/user')
const messageRouter = require('./routes/message');
const app = express();


app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST' ,'PUT','PATCH', 'DELETE'],        
  credentials: true                
}));


app.use(express.json())

app.use("/api",authRouter);
app.use('/api',profileRouter);
app.use('/api',requestRouter);
app.use('/api',userRouter);
app.use('/api', messageRouter);



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