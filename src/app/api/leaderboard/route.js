// src\app\api\leaderboard\route.js
import { NextResponse } from "next/server";
import Influencer from "@/models/Influencer";
import dbConnect from "@/lib/db";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const timeRange = searchParams.get("timeRange") || "all";
    const limit = parseInt(searchParams.get("limit")) || 50;

    let query = {};
    if (category) {
      query.categories = category;
    }

    // Add time range filter
    if (timeRange !== "all") {
      const dateLimit = new Date();
      switch (timeRange) {
        case "week":
          dateLimit.setDate(dateLimit.getDate() - 7);
          break;
        case "month":
          dateLimit.setMonth(dateLimit.getMonth() - 1);
          break;
        case "year":
          dateLimit.setFullYear(dateLimit.getFullYear() - 1);
          break;
      }
      query.lastUpdated = { $gte: dateLimit };
    }

    const influencers = await Influencer.find(query)
      .sort({ trustScore: -1 })
      .limit(limit)
      .select("name categories followers trustScore claims");

    return NextResponse.json(influencers);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
