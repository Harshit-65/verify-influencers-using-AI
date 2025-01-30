import Link from "next/link";

const getTrustScoreColor = (score) => {
  if (score >= 90) return "text-[#22c55e] hover:text-[#22c55e]"; // green
  if (score >= 50) return "text-yellow-500 hover:text-yellow-400"; // yellow
  return "text-red-500 hover:text-red-400"; // red
};

const getTrustScoreBackground = (score) => {
  if (score >= 90) return "bg-[#22c55e]/10";
  if (score >= 50) return "bg-yellow-500/10";
  return "bg-red-500/10";
};

export default function LeaderboardTable({ data }) {
  return (
    <div className="bg-[#112240] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1d3a6e]">
              <th className="px-6 py-4 text-left text-sm font-roboto text-gray-300">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-sm font-roboto text-gray-300">
                Influencer
              </th>
              <th className="px-6 py-4 text-left text-sm font-roboto text-gray-300">
                Categories
              </th>
              <th className="px-6 py-4 text-left text-sm font-roboto text-gray-300">
                Followers
              </th>
              <th className="px-6 py-4 text-left text-sm font-roboto text-gray-300">
                Trust Score
              </th>
              <th className="px-6 py-4 text-left text-sm font-roboto text-gray-300">
                Claims
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((influencer, index) => (
              <tr
                key={influencer._id}
                className={index % 2 === 0 ? "bg-[#112240]" : "bg-[#1a2942]"}
              >
                <td className="px-6 py-4 font-bold">#{index + 1}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/influencer/${encodeURIComponent(influencer.name)}`}
                    className={`flex items-center ${getTrustScoreColor(
                      influencer.trustScore
                    )} transition-colors`}
                  >
                    <img
                      src={influencer.image || "/default-avatar.png"}
                      alt={influencer.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    {influencer.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {influencer.categories?.map((category) => (
                      <span
                        key={category}
                        className={`text-xs px-2 py-1 rounded ${getTrustScoreBackground(
                          influencer.trustScore
                        )}`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">{influencer.followers}</td>
                <td
                  className={`px-6 py-4 font-bold ${getTrustScoreColor(
                    influencer.trustScore
                  )}`}
                >
                  {influencer.trustScore}%
                </td>
                <td className="px-6 py-4">{influencer.claims?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
