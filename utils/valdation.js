
const bcrypt = require('bcrypt');
const User = require('../models/User')

const validator = require('validator');

const validateSignUpData = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).send("Name is not valid");
  }

  if (!validator.isEmail(email)) {
    return res.status(400).send("Email not valid");
  }

  if (!password || password.length < 6) {
    return res.status(400).send("Password too short");
  }

  next();
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills"
  ];

  return Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
};


const validatePasswordInput = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).send("Old password and new password are required");
  }

  if (newPassword.length < 6) {
    return res.status(400).send("New password must be at least 6 characters");
  }

  if (oldPassword === newPassword) {
    return res.status(400).send("New password must be different from old password");
  }

  next();
};


module.exports = {validateSignUpData,validateEditProfileData,validatePasswordInput}