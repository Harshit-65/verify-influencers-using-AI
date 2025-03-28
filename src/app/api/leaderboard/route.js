// src/app/api/leaderboard/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Influencer from "@/models/Influencer";
import Claim from "@/models/Claim";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "highest";

  try {
    // Base query
    let query = {};

    // Add category filter if specified and not "All Categories"
    if (category && category !== "All Categories") {
      query.categories = category;
    }

    // Get all influencers
    const influencers = await Influencer.find(query)
      .select("name image followerCount categories")
      .lean();

    // Get claim stats for each influencer
    const leaderboardData = await Promise.all(
      influencers.map(async (influencer) => {
        // Get claims for this influencer
        const claims = await Claim.find({
          influencerId: influencer._id,
        }).lean();

        // Calculate average trust score
        let trustScore = 0;
        if (claims.length > 0) {
          const totalScore = claims.reduce(
            (sum, claim) => sum + (claim.research?.trustScore || 0),
            0
          );
          trustScore = Math.round(totalScore / claims.length);
        }

        return {
          _id: influencer._id.toString(),
          name: influencer.name,
          image: influencer.image,
          followers: influencer.followerCount,
          categories: influencer.categories || [], // Ensure categories are included
          trustScore,
          claims: claims.length, // Just pass the count
        };
      })
    );

    // Sort the data
    leaderboardData.sort((a, b) => {
      if (sort === "highest") return b.trustScore - a.trustScore;
      if (sort === "lowest") return a.trustScore - b.trustScore;
      if (sort === "claims") return b.claims - a.claims;
      return b.trustScore - a.trustScore; // default sorting
    });

    return NextResponse.json({
      influencers: leaderboardData,
      stats: {
        totalInfluencers: leaderboardData.length,
        totalClaims: leaderboardData.reduce((sum, inf) => sum + inf.claims, 0),
        avgTrustScore: Math.round(
          leaderboardData.reduce((sum, inf) => sum + inf.trustScore, 0) /
            leaderboardData.length
        ),
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}
