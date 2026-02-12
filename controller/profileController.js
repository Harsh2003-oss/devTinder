const bcrypt = require("bcrypt");
const User = require("../models/User");

const {validateEditProfileData} = require('../utils/valdation');

const profileView = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const profileUpdate = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach(
      (key) => (loggedInUser[key] = req.body[key])
    );

    await loggedInUser.save();

    const { buildSkillWeights } = require("../services/skillWeightService");
await buildSkillWeights();


    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updatePassword = async (req,res) =>{

    
    try {
        const {oldPassword,newPassword} = req.body;

        const user = await User.findById(req.user._id).select("+password");

        const isMatch = await bcrypt.compare(oldPassword,user.password);

        if(!isMatch){
            return res.status(400).send("Old password is incorrect");
        }

        const hashedPassword = await User.hashPassword(newPassword);
        user.password = hashedPassword;

        await user.save();

        res.send("Password updated successfully")
    } catch (error) {
            res.status(500).send(error.message);
    }
}

module.exports = { profileView, profileUpdate ,updatePassword};
