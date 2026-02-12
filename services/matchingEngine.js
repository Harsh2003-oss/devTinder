const { getSkillWeight } = require("./skillWeightService");

const calculateMatchScore = (loggedInUser, otherUser) => {

  const loggedInSkills = loggedInUser.skills || [];
  const userSkills = otherUser.skills || [];

  const commonSkills = loggedInSkills.filter(skill =>
    userSkills.includes(skill)
  );

  let weightedScore = 0;

  commonSkills.forEach(skill => {
    weightedScore += getSkillWeight(skill);
  });

  return Math.round(weightedScore * 100);
};

module.exports = { calculateMatchScore };
