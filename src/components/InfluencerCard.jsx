import Link from "next/link";

export default function InfluencerCard({ influencer }) {
  return (
    <div className="flex flex-col bg-[#112240] p-6 rounded-lg">
      <div className="flex items-center gap-4">
        <img
          src={influencer.image || "/default-avatar.png"}
          alt={influencer.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-bold font-roboto">{influencer.name}</h3>
          <p className="text-gray-400 mt-1">{influencer.followers} followers</p>
        </div>
      </div>
      {influencer.summary && (
        <p className="text-gray-300 mt-4">{influencer.summary}</p>
      )}
    </div>
  );
}
