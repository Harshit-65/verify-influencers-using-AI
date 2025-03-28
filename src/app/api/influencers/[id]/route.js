import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Influencer from "@/models/Influencer";
import Claim from "@/models/Claim";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    
    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid influencer ID" },
        { status: 400 }
      );
    }

    // Get influencer data
    const influencer = await Influencer.findById(id).lean();
    
    if (!influencer) {
      return NextResponse.json(
        { error: "Influencer not found" },
        { status: 404 }
      );
    }
    
    // Get all claims for this influencer
    const claims = await Claim.find({ influencerId: id })
      .sort({ timestamp: -1 }) // Sort by newest first
      .lean();
    
    // Calculate overall stats
    const verifiedCount = claims.filter(c => c.research?.verificationStatus === "Verified").length;
    const questionableCount = claims.filter(c => c.research?.verificationStatus === "Questionable").length;
    const debunkedCount = claims.filter(c => c.research?.verificationStatus === "Debunked").length;
    
    let averageTrustScore = 0;
    if (claims.length > 0) {
      const totalScore = claims.reduce((sum, claim) => sum + (claim.research?.trustScore || 0), 0);
      averageTrustScore = Math.round(totalScore / claims.length);
    }
    
    // Group claims by category
    const categoryCounts = {};
    claims.forEach(claim => {
      const category = claim.research?.category || "Uncategorized";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Format the response
    const response = {
      influencer: {
        id: influencer._id,
        name: influencer.name,
        summary: influencer.influencerSummary,
        followerCount: influencer.followerCount,
        image: influencer.image,
        createdAt: influencer.createdAt,
        updatedAt: influencer.updatedAt
      },
      stats: {
        totalClaims: claims.length,
        averageTrustScore,
        verifiedCount,
        questionableCount,
        debunkedCount,
        categories: categoryCounts
      },
      claims
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Influencer details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch influencer details" },
      { status: 500 }
    );
  }
} 