// src\app\api\analyze\route.js

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Influencer from "@/models/Influencer";
import dbConnect from "@/lib/db";
import { analysisPrompt } from "@/utils/prompts";
import { fetchGoogleResults } from "@/lib/googleSearch";
import { removeDuplicates, calculateAverageScore } from "@/utils/helpers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { name, claimsCount, journals, includeRevenue, timeRange, notes } =
      body;

    // Gemini Analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = analysisPrompt(
      name,
      timeRange,
      claimsCount,
      includeRevenue,
      journals,
      notes
    );

    const response = await model.generateContent(prompt);
    console.log(response.response.text());
    const rawResponse = response.response.text();

    // Clean markdown code blocks from response
    const cleanedResponse = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const analysis = JSON.parse(cleanedResponse);

    // Process and deduplicate claims
    const uniqueClaims = removeDuplicates(analysis.claims);
    const processedClaims = await Promise.all(
      uniqueClaims.slice(0, claimsCount).map(async (claim) => ({
        ...claim,
        date: new Date(),
        sourceURL: await fetchGoogleResults(`${claim.claim} ${name}`),
        researchURL: await fetchGoogleResults(
          `${claim.studyTitle} ${journals.join(" ")}`
        ),
      }))
    );

    // Calculate trust score
    const trustScore = calculateAverageScore(processedClaims);

    // Update Influencer
    const updatedInfluencer = await Influencer.findOneAndUpdate(
      { name },
      {
        $set: {
          bio: analysis.bio,
          followers: analysis.followers,
          ...(includeRevenue && { yearlyRevenue: analysis.yearlyRevenue }),
          categories: analysis.categories,
          claims: processedClaims,
          trustScore,
          lastUpdated: new Date(),
          analysisParams: {
            timeRange,
            claimsCount,
            journals,
            assistantNote: notes,
          },
        },
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
