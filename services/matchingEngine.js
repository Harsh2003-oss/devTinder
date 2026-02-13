const { getSkillWeight } = require("./skillWeightService");
const { calculateBioSimilarity } = require("../utils/bioSimilarity");

const calculateMatchScore = (loggedInUser, otherUser) => {

  const loggedInSkills = loggedInUser.skills || [];
  const userSkills = otherUser.skills || [];

  const commonSkills = loggedInSkills.filter(skill =>
    userSkills.includes(skill)
  );

  const allSkills = new Set([
    ...loggedInSkills,
    ...userSkills
  ]);

  let weightedCommon = 0;
  let weightedTotal = 0;

  // Sum weights of common skills
  commonSkills.forEach(skill => {
    weightedCommon += getSkillWeight(skill);
  });

  // Sum weights of all unique skills
  allSkills.forEach(skill => {
    weightedTotal += getSkillWeight(skill);
  });

  const skillScore = weightedTotal > 0
    ? (weightedCommon / weightedTotal)
    : 0;

  // ---- BIO PART ----
  const bioScore = calculateBioSimilarity(loggedInUser, otherUser);

  // Combine (80% skill, 20% bio)
  const finalScore =
    (0.8 * skillScore * 100) +
    (0.2 * bioScore * 100);

  return Math.round(finalScore);
};

module.exports = { calculateMatchScore };
