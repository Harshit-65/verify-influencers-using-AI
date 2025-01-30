// src\app\leaderboard\page.jsx
import Header from "@/components/Header";
import LeaderboardTable from "@/components/LeaderboardTable";
import { CategoryFilter } from "@/components/CategoryFilter";
import TimeRangeSelector from "@/components/TimeRangeSelector";

async function getData(searchParams) {
  const params = new URLSearchParams({
    limit: 50,
    timeRange: searchParams.timeRange || "all",
    ...(searchParams.category && { category: searchParams.category }),
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard?${params}`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch leaderboard data");
  }

  return res.json();
}

export const metadata = {
  title: "Influencer Leaderboard | VerifyInfluencers",
  description:
    "Top health and wellness influencers ranked by trust score and scientific accuracy",
};

export default async function LeaderboardPage({ searchParams }) {
  const influencers = await getData(searchParams);

  return (
    <div className="min-h-screen bg-[#0a192f]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">
            Influencer Leaderboard
          </h1>
          <div className="flex gap-4 flex-wrap justify-center">
            <CategoryFilter selected={searchParams.category} />
            <TimeRangeSelector selected={searchParams.timeRange || "all"} />
          </div>
        </div>
        <LeaderboardTable data={influencers} className="animate-fade-in" />
      </main>
    </div>
  );
}
