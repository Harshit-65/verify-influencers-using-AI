import InfluencerCard from "@/components/InfluencerCard";
import ClaimCard from "@/components/ClaimCard";

export default function InfluencerProfile({ data, className }) {
  const influencer = data;

  return (
    <div className={`${className} text-white`}>
      {/* Profile Header */}
      <InfluencerCard influencer={influencer} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-[#1A1B1F] p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span>Trust Score</span>
            <i className="fas fa-chart-line text-green-400"></i>
          </div>
          <div className="text-3xl font-bold text-[#22c55e]">
            {influencer.trustScore}%
          </div>
          <div className="text-xs text-gray-400">
            Based on {influencer.claims?.length || 0} verified claims
          </div>
        </div>

        {influencer.yearlyRevenue && (
          <div className="bg-[#1A1B1F] p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span>Yearly Revenue</span>
              <i className="fas fa-dollar-sign text-green-400"></i>
            </div>
            <div className="text-3xl font-bold text-[#22c55e]">
              {influencer.yearlyRevenue}
            </div>
            <div className="text-xs text-gray-400">Estimated earnings</div>
          </div>
        )}

        <div className="bg-[#1A1B1F] p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span>Followers</span>
            <i className="fas fa-chart-line text-green-400"></i>
          </div>
          <div className="text-3xl font-bold text-[#22c55e]">
            {influencer.followers}
          </div>
          <div className="text-xs text-gray-400">Total following</div>
        </div>
      </div>

      {/* Claims Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Claims Analysis</h2>
        <div className="space-y-4">
          {influencer.claims?.map((claim) => (
            <ClaimCard key={claim._id} claim={claim} />
          ))}
        </div>
      </div>
    </div>
  );
}
