export const removeDuplicates = (claims) => {
  const seen = new Set();
  return claims.filter((claim) => {
    const key = claim.claim.toLowerCase().trim();
    return seen.has(key) ? false : seen.add(key);
  });
};

// Function to calculate similarity between two strings using Levenshtein distance
export const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  // Calculate Levenshtein distance
  const costs = new Array();
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (longer[i - 1] !== shorter[j - 1]) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[shorter.length] = lastValue;
    }
  }

  // Calculate similarity ratio
  return 1 - costs[shorter.length] / longer.length;
};

export const calculateAverageScore = (claims) => {
  if (!claims.length) return 0;
  return (
    claims.reduce((sum, claim) => sum + claim.trustScore, 0) / claims.length
  );
};
