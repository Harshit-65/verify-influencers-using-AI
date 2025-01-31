//src\app\api\analyze\route.js

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Influencer from "@/models/Influencer";
import dbConnect from "@/lib/db";
import { analysisPrompt } from "@/utils/prompts";
import {
  fetchSourceURL,
  fetchResearchURL,
  fetchImageURL,
} from "@/lib/googleSearch";
import {
  removeDuplicates,
  calculateAverageScore,
  calculateSimilarity,
} from "@/utils/helpers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { name, claimsCount, journals, includeRevenue, timeRange, notes } =
      body;

    // Gemini Analysis
    // jounals from request in database
    //

    // const imageResult = await fetchImageURL(name);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const prompt = analysisPrompt(
      name,
      timeRange,
      claimsCount,
      includeRevenue,
      journals,
      notes
    );
    const response = await model.generateContent(prompt);
    const rawResponse = response.response.text();

    //  parse the response
    const cleanedResponse = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let jsonContent = cleanedResponse.split(/\*\*Note:\*\*/)[0].trim();
    //   .replace(/\/\*[\s\S]*?\*\//g, "")
    //   .replace(/\/\/.*$/gm, "")
    //   .replace(/,(\s*[}\]])/g, "$1")
    //   .replace(/'/g, '"')
    //   .trim();

    console.log("Raw JSON Content:", jsonContent);
    const analysis = JSON.parse(jsonContent);

    // Find existing influencer
    const existingInfluencer = await Influencer.findOne({ name });

    // Process new claims and check similarity with existing claims
    const uniqueClaims = removeDuplicates(analysis.claims);
    let processedClaims = await Promise.all(
      uniqueClaims.slice(0, claimsCount).map(async (claim) => {
        // Get source and research URLs with their queries
        const sourceResult = await fetchSourceURL(name, claim.claim);
        const researchResult = await fetchResearchURL(
          claim.studyTitle,
          journals
        );

        console.log(sourceResult, researchResult);

        console.log("Claim:", claim.claim);
        return {
          ...claim,
          date: new Date(),
          sourceURL: sourceResult.url,
          researchURL: researchResult.url,
          aiSummary: claim.summary,
          searchQueries: {
            sourceQuery: sourceResult.query,
            researchQuery: researchResult.query,
          },
        };
      })
    );

    // If influencer exists, merge claims with similarity check
    if (existingInfluencer) {
      const existingClaims = existingInfluencer.claims;
      const similarityThreshold = 0.8; // 80% similarity threshold

      processedClaims = processedClaims.filter((newClaim) => {
        // Check if the new claim is significantly different from all existing claims
        return !existingClaims.some(
          (existingClaim) =>
            calculateSimilarity(newClaim.claim, existingClaim.claim) >=
            similarityThreshold
        );
      });

      // Combine existing and new claims
      processedClaims = [...existingClaims, ...processedClaims];
    }

    // Calculating new trust score based on all claims
    const trustScore = calculateAverageScore(processedClaims);

    // update object with conditional fields
    const updateObject = {
      claims: processedClaims,
      trustScore,
      lastUpdated: new Date(),
      analysisParams: {
        timeRange,
        claimsCount,
        journals,
        assistantNote: notes,
      },
    };

    // Only update non-essential fields if they don't exist or if this is a new record
    if (!existingInfluencer) {
      const imageResult = await fetchImageURL(name);

      updateObject.bio = analysis.bio;
      updateObject.image = imageResult.imageUrl;
      updateObject.followers = analysis.followers;
      updateObject.categories = analysis.categories;
    }

    // Add revenue analysis only if requested
    if (includeRevenue) {
      updateObject.yearlyRevenue = analysis.yearlyRevenue;
    }

    // Update or create influencer
    const updatedInfluencer = await Influencer.findOneAndUpdate(
      { name },
      {
        $set: updateObject,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      slug: encodeURIComponent(name),
      influencer: updatedInfluencer,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze influencer" },
      { status: 500 }
    );
  }
}
