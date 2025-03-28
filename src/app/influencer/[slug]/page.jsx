// src\app\influencer\[slug]\page.jsx
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import InfluencerProfile from "@/components/InfluencerProfile";
import Influencer from "@/models/Influencer";
import Claim from "@/models/Claim";
import dbConnect from "@/lib/db";
import { calculateAverageTrustScore } from "@/utils/helpers";

async function getInfluencer(slug) {
  if (!slug) return null;

  await dbConnect();

  const influencer = await Influencer.findOne({
    name: decodeURIComponent(slug),
  }).lean();

  if (!influencer) {
    notFound();
  }

  // Fetch claims separately
  const claims = await Claim.find({
    influencerId: influencer._id,
  })
    .sort({ timestamp: -1 })
    .lean();

  // Calculate average trust score
  const averageTrustScore = calculateAverageTrustScore(claims);

  // Transform claims
  const transformedClaims = claims.map((claim) => ({
    _id: claim._id.toString(),
    text: claim.claim,
    date: claim.timestamp.toISOString(),
    category: claim.research?.category || "Uncategorized",
    status: claim.research?.verificationStatus || "Pending",
    trustScore: claim.research?.trustScore || 0,
    source: claim.research?.articleLinks?.[0] || "",
    analysis: claim.research?.researchSummary || "",
  }));

  // Transform the influencer document
  const transformedInfluencer = {
    _id: influencer._id.toString(),
    name: influencer.name,
    summary: influencer.influencerSummary,
    image: influencer.image,
    followers: influencer.followerCount,
    lastUpdated: influencer.updatedAt.toISOString(),
    claims: transformedClaims,
    trustScore: averageTrustScore,
  };

  return transformedInfluencer;
}

export async function generateMetadata({ params }) {
  const slug = await Promise.resolve(params.slug);
  const influencer = await getInfluencer(slug);

  return {
    title: `${influencer.name} - Trust Score Analysis | VerifyInfluencers`,
    description:
      influencer.summary || `Analysis of ${influencer.name}'s health claims`,
  };
}

export default async function InfluencerPage({ params }) {
  const slug = await Promise.resolve(params.slug);
  const influencer = await getInfluencer(slug);

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <Header />
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <InfluencerProfile data={influencer} className="animate-fade-in" />
      </main>
    </div>
  );
}
