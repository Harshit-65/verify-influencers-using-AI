import crypto from "crypto";

// Function to remove duplicates based on normalization
export function removeDuplicates(array, key = "claim") {
  if (!Array.isArray(array)) return [];

  const seen = new Set();
  return array.filter((item) => {
    const value = key ? item[key] : item;
    const normalizedValue =
      typeof value === "string" ? normalizeClaim(value) : JSON.stringify(value);

    if (seen.has(normalizedValue)) return false;
    seen.add(normalizedValue);
    return true;
  });
}

// Function to normalize claim text
export function normalizeClaim(claim) {
  if (!claim || typeof claim !== "string") return "";

  return claim
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

// Function to generate MD5 hash for a claim
export function generateClaimHash(claim) {
  if (!claim || typeof claim !== "string") return "";

  // First normalize the claim
  const normalizedClaim = normalizeClaim(claim);

  // Extract key terms and sort them
  const keyTerms = normalizedClaim
    .split(" ")
    .filter((word) => word.length > 3) // Filter out short words
    .sort()
    .join(" ");

  // Generate hash from sorted key terms
  return crypto.createHash("md5").update(keyTerms).digest("hex");
}

// Function to calculate the average trust score
export function calculateAverageTrustScore(claims) {
  if (!claims || claims.length === 0) return 0;

  const total = claims.reduce((sum, claim) => {
    return sum + (claim.research?.trustScore || 0);
  }, 0);

  return Math.round(total / claims.length);
}

// Calculate string similarity (Levenshtein distance based)
export function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;

  // Create matrix of size (len1+1) x (len2+1)
  const matrix = Array(len1 + 1)
    .fill()
    .map(() => Array(len2 + 1).fill(0));

  // Fill first row and column
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  // Fill the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  // Calculate similarity as 1 - normalized distance
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1 : 1 - matrix[len1][len2] / maxLen;
}

export const calculateAverageScore = (claims) => {
  if (!claims.length) return 0;
  return (
    claims.reduce((sum, claim) => sum + claim.trustScore, 0) / claims.length
  );
};

// Function to check if two claims are similar
export function areSimilarClaims(claim1, claim2, threshold = 0.85) {
  if (!claim1 || !claim2) return false;

  // Normalize both claims
  const normalized1 = normalizeClaim(claim1);
  const normalized2 = normalizeClaim(claim2);

  // Calculate similarity
  const similarity = calculateSimilarity(normalized1, normalized2);

  return similarity >= threshold;
}

// Update the duplicate checking logic in your API route
export function isDuplicateClaim(newClaim, existingClaims, threshold = 0.85) {
  return existingClaims.some((existing) =>
    areSimilarClaims(newClaim, existing.claim, threshold)
  );
}
