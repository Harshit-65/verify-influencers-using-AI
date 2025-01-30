export const removeDuplicates = (claims) => {
  const seen = new Set();
  return claims.filter((claim) => {
    const key = claim.claim.toLowerCase().trim();
    return seen.has(key) ? false : seen.add(key);
  });
};

export const calculateAverageScore = (claims) => {
  if (!claims.length) return 0;
  return (
    claims.reduce((sum, claim) => sum + claim.trustScore, 0) / claims.length
  );
};
