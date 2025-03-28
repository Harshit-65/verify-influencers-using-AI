// src/app/leaderboard/page.jsx
import Header from "@/components/Header";
import LeaderboardTable from "@/components/LeaderboardTable";
import CategoryFilter from "@/components/CategoryFilter";
import SortSelector from "@/components/SortSelector";

async function getData(searchParams) {
  try {
    const params = new URLSearchParams({
      limit: 50,
      timeRange: searchParams.timeRange || "all",
      sort: searchParams.sort || "highest",
      ...(searchParams.category && { category: searchParams.category }),
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard?${params}`
      // { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch leaderboard data: ${res.status}`);
    }

    const data = await res.json();

    // default values for stats if they're missing
    return {
      influencers: data.influencers || [],
      stats: {
        totalInfluencers: data.stats?.totalInfluencers || 0,
        totalClaims: data.stats?.totalClaims || 0,
        avgTrustScore: data.stats?.avgTrustScore || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return {
      influencers: [],
      stats: {
        totalInfluencers: 0,
        totalClaims: 0,
        avgTrustScore: 0,
      },
    };
  }
}

export default async function LeaderboardPage({ searchParams }) {
  // Convert searchParams to URLSearchParams
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    params.append(key, value);
  }

  const { influencers, stats } = await getData(searchParams);

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-[#112240] p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <i className={`fas ${icon} text-[#22c55e] text-3xl`}></i>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in min-h-screen bg-[#0a192f]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 block w-full">
            Influencer Leaderboard
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active Influencers"
            value={stats.totalInfluencers.toLocaleString()}
            icon="fa-users"
          />
          <StatCard
            title="Claims Verified"
            value={stats.totalClaims.toLocaleString()}
            icon="fa-check-circle"
          />
          <StatCard
            title="Average Trust Score"
            value={`${stats.avgTrustScore.toFixed(1)}%`}
            icon="fa-star"
          />
        </div>

        <div className="flex justify-between m-5">
          <CategoryFilter
            selected={searchParams.category}
            searchParams={params}
          />
          <SortSelector selected={searchParams.sort} searchParams={params} />
        </div>

        <LeaderboardTable data={influencers} />
      </main>
    </div>
  );
}
