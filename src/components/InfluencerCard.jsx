import Link from "next/link";

export default function InfluencerCard({ influencer }) {
  return (
    <Link
      href={`/influencer/${encodeURIComponent(influencer.name)}`}
      // className="bg-[#112240] p-6 rounded-lg hover:bg-[#1d3a6e] transition-colors"
    >
      <div className="flex items-center gap-4 bg-[#112240] p-6 rounded-lg hover:bg-[#1d3a6e] transition-colors">
        <img
          src={influencer.image || "/default-avatar.png"}
          alt={influencer.name}
          className="w-27 h-27 rounded-full "
        />
        <div>
          <h3 className="text-xl font-bold font-roboto">{influencer.name}</h3>
          <div className="flex gap-2 mt-2">
            {influencer.categories?.map((category) => (
              <span
                key={category}
                className="text-sm bg-[#22c55e] text-black px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 text-sm">{influencer.bio}</span>
            <span className="text-[#22c55e] font-bold">
              {/* {influencer.trustScore}% */}
            </span>
            <span className="text-gray-400 text-sm">
              {/* {influencer.followers} followers */}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
