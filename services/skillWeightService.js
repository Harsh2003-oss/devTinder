const User = require("../models/User");

let skillWeightMap = {};

const buildSkillWeights = async () => {
  const users = await User.find({}).select("skills");

  const skillFrequency = {};

  users.forEach(user => {
    (user.skills || []).forEach(skill => {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    });
  });

  const totalUsers = users.length;

  const weights = {};

  for (let skill in skillFrequency) {
    // Inverse frequency weighting
    weights[skill] = 1 / skillFrequency[skill];
  }

  skillWeightMap = weights;

  console.log("Skill weights computed successfully ");
};

const getSkillWeight = (skill) => {
  return skillWeightMap[skill] || 0;
};

module.exports = {
  buildSkillWeights,
  getSkillWeight
};
