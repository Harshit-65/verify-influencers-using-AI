//src\app\api\analyze\route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Influencer from "@/models/Influencer";
import Claim from "@/models/Claim";
import { getYoutubeTranscript } from "@/utils/youtubeTranscript";
import { generateClaimHash, isDuplicateClaim } from "@/utils/helpers";
import { extractClaimsPrompt, influencerSummaryPrompt } from "@/utils/prompts";
import { queryGemini } from "@/lib/geminiApi";
import { fetchImageURL } from "@/lib/googleSearch";

export async function POST(request) {
  try {
    await dbConnect();

    const { name: influencerName, inputType, inputData } = await request.json();
    const currentDate = new Date().toISOString().split("T")[0];
    let influencer = await Influencer.findOne({ name: influencerName });

    // Extract claim text
    let claimText = inputData;
    if (inputType === "youtube") {
      const transcript = await getYoutubeTranscript(inputData);
      const extractPrompt = extractClaimsPrompt(transcript);
      claimText = await queryGemini(extractPrompt);
    }

    // Generate hash for duplicate checking
    const claimHash = generateClaimHash(claimText);

    // Check for duplicate claim if influencer exists
    if (influencer) {
      const existingClaims = await Claim.find({
        influencerId: influencer._id,
      }).lean();

      if (isDuplicateClaim(claimText, existingClaims)) {
        return NextResponse.json(
          {
            success: false,
            message: "A similar claim has already been verified",
            influencerId: influencer._id,
          },
          { status: 409 }
        );
      }
    } else {
      // Only fetch influencer data if they don't exist
      const summaryPrompt = influencerSummaryPrompt(influencerName);
      const summaryData = await queryGemini(summaryPrompt);
      const imageResult = await fetchImageURL(influencerName);

      // Create new influencer
      influencer = await Influencer.create({
        name: influencerName,
        influencerSummary: summaryData.summary,
        followerCount: summaryData.followerCount,
        image: imageResult.imageUrl,
        categories: [], // Initialize empty categories array
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Query backend API for claim analysis
    const searchQuery = encodeURIComponent(claimText);
    const response = await fetch(
      `http://localhost:8000/search?query=${searchQuery}&date_context=${currentDate}&stored_location=us&pro_mode=true`
    );
    const data = await response.json();

    // Extract research data from response
    const [trustScore, category, verificationStatus] = data.llm_response
      .split("\n")
      .map((line) => line.split(": ")[1]);
    const researchSummary = data.llm_response.split("RESEARCH_SUMMARY: ")[1];

    // Create new claim
    const newClaim = await Claim.create({
      influencerId: influencer._id,
      claim: claimText,
      duplicateHash: claimHash,
      research: {
        researchSummary,
        articleLinks: data.sources.organic.map((source) => source.link),
        trustScore: parseInt(trustScore),
        category,
        verificationStatus,
      },
      timestamp: new Date(),
    });

    // Update the influencer with the new claim and category if needed
    const updateData = {
      $push: {
        claims: {
          text: claimText,
          date: new Date(),
          category: category,
          status: verificationStatus,
          trustScore: parseInt(trustScore),
          source: data.sources.organic[0]?.link || "",
          analysis: researchSummary,
        },
      },
      $set: { updatedAt: new Date() },
    };

    // Add category to categories array if it doesn't exist
    if (!influencer.categories?.includes(category)) {
      updateData.$addToSet = { categories: category };
    }

    await Influencer.findByIdAndUpdate(influencer._id, updateData, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      influencer,
      claims: [newClaim],
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze claim" },
      { status: 500 }
    );
  }
}
