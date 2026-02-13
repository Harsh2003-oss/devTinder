const STOP_WORDS = [
  "the", "is", "and", "i", "am", "a", "an", "to",
  "of", "for", "in", "on", "with", "looking"
];

function processText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .split(" ")
    .filter(word =>
      word.length > 2 &&
      !STOP_WORDS.includes(word)
    );
}

function calculateBioSimilarity(userA, userB) {
  const wordsA = processText(userA.about);
  const wordsB = processText(userB.about);

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  const intersection = new Set(
    [...setA].filter(word => setB.has(word))
  );

  const union = new Set([...setA, ...setB]);

  if (union.size === 0) return 0;

  return intersection.size / union.size;
}

module.exports = { calculateBioSimilarity };
