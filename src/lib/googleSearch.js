// //src\lib\googleSearch.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Extract keywords using Gemini
// async function extractKeywords(text, type = "claim") {
//   const prompt =
//     type === "claim"
//       ? `Extract 3-4 most important keywords related to health/fitness from this claim. Return only the keywords separated by commas, no explanations: "${text}"`
//       : `Extract 3-4 most important scientific/research keywords from this study title. Return only the keywords separated by commas, no explanations: "${text}"`;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     return result.response
//       .text()
//       .split(",")
//       .map((keyword) => keyword.trim());
//   } catch (error) {
//     console.error("Keyword extraction error:", error);
//     // Fallback to basic keyword extraction
//     return text
//       .toLowerCase()
//       .split(" ")
//       .filter((word) => word.length > 4)
//       .slice(0, 3);
//   }
// }

// Format claim-related query
// async function formatClaimQuery(influencerName, claim) {
//   const keywords = await extractKeywords(claim, "claim");
//   return `${influencerName} ${keywords.join(" ")}`;
// }

// Format research-related query
// async function formatResearchQuery(studyTitle, journals) {
//   const keywords = await extractKeywords(studyTitle, "research");
//   return `${keywords.join(" ")} ${journals.join(" ")}`;
// }

// //  Google search function
// async function googleSearch(query, cseId) {
//   try {
//     const res = await fetch(
//       `https://www.googleapis.com/customsearch/v1?` +
//         new URLSearchParams({
//           q: query,
//           key: process.env.GOOGLE_API_KEY,
//           cx: cseId,
//           num: 1,
//         })
//     );

//     const data = await res.json();
//     return {
//       url: data.items?.[0]?.link || "",
//       query: query,
//     };
//   } catch (error) {
//     console.error("Google search error:", error);
//     return { url: "", query: query };
//   }
// }

// // source URLs
// export async function fetchSourceURL(influencerName, claim) {
//   const formattedQuery = await formatClaimQuery(influencerName, claim);
//   const result = await googleSearch(
//     formattedQuery,
//     process.env.GOOGLE_CSE_ID_SOURCE
//   );
//   return result;
// }

// //  research URLs
// export async function fetchResearchURL(studyTitle, journals) {
//   const formattedQuery = await formatResearchQuery(studyTitle, journals);
//   const result = await googleSearch(
//     formattedQuery,
//     process.env.GOOGLE_CSE_ID
//   );
//   return result;
// }

// // Backwards compatibility for existing code
// export async function fetchGoogleResults(query) {
//   const result = await googleSearch(query, process.env.GOOGLE_CSE_ID);
//   return result.url;
// }

/**
 * Helper to fetch an influencer image using Google Search
 */
export async function fetchImageURL(influencerName) {
  try {
    const query = `${influencerName} picture`;
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?` +
        new URLSearchParams({
          q: query,
          key: process.env.GOOGLE_API_KEY,
          cx: process.env.GOOGLE_CSE_ID,
          num: 1,
          searchType: 'image'
        })
    );

    const data = await res.json();

    // Try to get image from the first result
    const imageUrl = data.items?.[0]?.link || "";

    // Fallback to thumbnail if link is not available
    const thumbnailImage = data.items?.[0]?.image?.thumbnailLink || "";

    return {
      imageUrl: imageUrl || thumbnailImage || "",
      query: query,
    };
  } catch (error) {
    console.error("Image search error:", error);
    return { imageUrl: "", query: query };
  }
}
