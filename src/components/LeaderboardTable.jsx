import Link from "next/link";

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
                    className="flex items-center hover:text-[#22c55e] transition-colors"
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
                        className="text-xs bg-[#22c55e] text-black px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">{influencer.followers}</td>
                <td className="px-6 py-4 text-[#22c55e] font-bold">
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
