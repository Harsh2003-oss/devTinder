

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

    let baseSimilarity = allSkills.size > 0
        ? (commonSkills.length / allSkills.size)
        : 0;

    // Rare skill boost
    const rareSkills = ["TensorFlow", "Rust", "Kubernetes", "Docker", "AWS"];

    let rareBoost = 0;

    commonSkills.forEach(skill => {
        if (rareSkills.includes(skill)) {
            rareBoost += 0.05;
        }
    });

    // Premium boost
    let premiumBoost = otherUser.isPremium ? 0.05 : 0;

    let finalScore = baseSimilarity + rareBoost + premiumBoost;

    return Math.round(finalScore * 100);
};

module.exports = { calculateMatchScore };
