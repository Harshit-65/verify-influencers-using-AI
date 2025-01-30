export default function ClaimCard({ claim }) {
  const statusConfig = {
    Verified: { color: "green-400", icon: "fa-check-circle" },
    Questionable: { color: "yellow-400", icon: "fa-question-circle" },
    Debunked: { color: "red-400", icon: "fa-times-circle" },
  };

  const { color, icon } = statusConfig[claim.status] || statusConfig.Verified;

  return (
    <div className="bg-[#1A1B1F] p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className={`text-${color} mb-1`}>
            <i className={`fas ${icon} mr-2`}></i>
            {new Date(claim.date).toLocaleDateString()}
          </div>
          <div className="font-medium">Claim: {claim.claim}</div>
          <div className="text-sm text-gray-400 mb-2">Ai Summary</div>
          <div className="text-gray-400 text-sm mt-2">{claim.aiSummary}</div>
        </div>
        <div className={`text-2xl font-bold text-${color}`}>
          {claim.trustScore}%
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-4">
          {claim.sourceURL && (
            <a
              href={claim.sourceURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22c55e] hover:underline"
            >
              <i className="fas fa-link mr-2"></i>
              View Source
            </a>
          )}
          {claim.researchURL && (
            <a
              href={claim.researchURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22c55e] hover:underline"
            >
              <i className="fas fa-book-open mr-2"></i>
              View Research
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
