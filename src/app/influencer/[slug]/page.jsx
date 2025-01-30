// src\app\influencer\[slug]\page.jsx
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import InfluencerProfile from "@/components/InfluencerProfile";
import Influencer from "@/models/Influencer";
import dbConnect from "@/lib/db";

async function getInfluencer(slug) {
  await dbConnect();
  const influencer = await Influencer.findOne({
    name: decodeURIComponent(slug),
  }).lean();

  if (!influencer) {
    notFound();
  }

  return {
    ...influencer,
    _id: influencer._id.toString(),
    lastUpdated: influencer.lastUpdated.toISOString(),
    claims: influencer.claims.map((claim) => ({
      ...claim,
      _id: claim._id.toString(),
      date: claim.date.toISOString(),
    })),
  };
}

export async function generateMetadata({ params }) {
  const influencer = await getInfluencer(params.slug);
  return {
    title: `${influencer.name} - Trust Score Analysis | VerifyInfluencers`,
    description: influencer.bio,
  };
}

export default async function InfluencerPage({ params }) {
  const influencer = await getInfluencer(params.slug);

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <Header />
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <InfluencerProfile data={influencer} className="animate-fade-in" />
      </main>
    </div>
  );
}
