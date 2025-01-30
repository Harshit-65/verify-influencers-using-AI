// src\app\api\influencers\route.js
import { NextResponse } from "next/server";
import Influencer from "@/models/Influencer";
import dbConnect from "@/lib/db";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "trustScore";
    const order = searchParams.get("order") || "desc";

    let query = {};
    if (name) {
      query.name = new RegExp(name, "i");
    }
    if (category) {
      query.categories = category;
    }

    const influencers = await Influencer.find(query)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .select("-claims.aiSummary");

    return NextResponse.json(influencers);
  } catch (error) {
    console.error("Influencer fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch influencers" },
      { status: 500 }
    );
  }
}
