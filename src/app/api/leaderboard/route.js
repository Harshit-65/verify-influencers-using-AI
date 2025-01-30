// src/app/api/leaderboard/route.js
import { NextResponse } from "next/server";
import Influencer from "@/models/Influencer";
import dbConnect from "@/lib/db";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "highest";
    const limit = parseInt(searchParams.get("limit")) || 50;

    const filter =
      category && category !== "All Categories" ? { categories: category } : {};

    const sortOrder = sort === "lowest" ? 1 : -1;

    // Get filtered influencers
    const influencers = await Influencer.find(filter)
      .sort({ trustScore: sortOrder })
      .limit(limit)
      .select("name categories followers trustScore claims image");

    // Get global stats (unfiltered)
    const stats = await Influencer.aggregate([
      {
        $group: {
          _id: null,
          totalInfluencers: { $sum: 1 },
          totalClaims: { $sum: { $size: "$claims" } },
          avgTrustScore: { $avg: "$trustScore" },
        },
      },
    ]);

    return NextResponse.json({
      influencers,
      stats: stats[0] || {
        totalInfluencers: 0,
        totalClaims: 0,
        avgTrustScore: 0,
      },
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
