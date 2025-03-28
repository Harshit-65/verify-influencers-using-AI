// Prompt for Gemini AI to extract claims from YouTube transcript
export const extractClaimsPrompt = (transcript) => `
Extract the most significant health or fitness claim from this YouTube video transcript.

TRANSCRIPT:
"""
${transcript}
"""

INSTRUCTIONS:
1. Identify the single most significant health claim made in the transcript
2. Extract only a direct health or wellness claim (statement claiming specific health effects, benefits, or outcomes)
3. Summarize the claim in a clear, concise sentence of 20-30 words
4. Focus on claims related to nutrition, medicine, mental health, or fitness
5. Return only the claim text, no additional formatting or explanation

EXAMPLE OUTPUT:
"Regular consumption of turmeric reduces inflammation and improves joint health."

Return ONLY the claim text as a string, no additional text or formatting.
`;

// Prompt for Perplexity AI to generate influencer summary
export const influencerSummaryPrompt = (influencerName) => `
Provide a brief summary of ${influencerName}'s online presence, including their approximate follower count across platforms.

Return the response as JSON with this structure:
{
  "summary": "A 60-80 word description of who this influencer is, their background, expertise, and content focus.",
  "followerCount": "10M" (no other text just follower count in this format: for thousand and M for million)
}

Return ONLY the valid JSON object, no additional text.
`;

// export const researchClaimPrompt = (claim) => `
// Provide a 50-word summary of credible scientific research about the following health claim:

// "${claim}"

// Your response must be formatted as JSON with the following structure:
// {
//   "researchSummary": "A concise 50-word summary of what credible scientific research says about this claim",
//   "articleLinks": [
//     "https://link1.com",
//     "https://link2.com",
//     "https://link3.com"
//   ],
//   "trustScore": 75, // A number from 0-100 indicating how well the claim is supported by science
//   "category": "Nutrition", // One of: Nutrition, Medicine, Mental Health, Fitness
//   "verificationStatus": "Verified" // One of: Verified, Questionable, Debunked
// }

// Return ONLY the valid JSON object, with no additional text or explanations.
// `;
