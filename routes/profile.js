const express = require('express')
const  profileRouter  = express.Router ();
const {userAuth} = require('../middlewares/auth')
const {profileView,profileUpdate,updatePassword} = require('../controller/profileController')
const {validatePasswordInput} = require('../utils/valdation')

profileRouter .get('/view',userAuth,profileView);
profileRouter .patch('/edit',userAuth,profileUpdate)
profileRouter.patch('/updatePassword',userAuth,validatePasswordInput,updatePassword)

module.exports = profileRouter ;
