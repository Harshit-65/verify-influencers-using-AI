"use client";
import { useState } from "react";

export default function ClaimCard({ claim }) {
  const [showSources, setShowSources] = useState(false);

  const getTrustScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return "text-green-400";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-red-500";
    }
  };

  // Convert single source string to array if needed
  const sourceLinks = Array.isArray(claim.source)
    ? claim.source
    : claim.source
    ? [claim.source]
    : [];

  return (
    <div className="bg-[#1A1B1F] rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="text-lg text-white">{claim.text}</div>
          <div className="text-sm text-gray-400">
            {new Date(claim.date).toLocaleDateString()}
          </div>
        </div>
        <div
          className={`text-2xl font-bold ${getTrustScoreColor(
            claim.trustScore
          )}`}
        >
          {claim.trustScore}%
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
            claim.status
          )} bg-opacity-20`}
        >
          {claim.status}
        </span>
        <span className="px-3 py-1 rounded-full text-sm bg-blue-500 bg-opacity-20 text-blue-400">
          {claim.category}
        </span>
      </div>

      <div className="text-gray-300">{claim.analysis}</div>

      {/* Sources Section */}
      <div className="space-y-2">
        <button
          onClick={() => setShowSources(!showSources)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <i className={`fas fa-chevron-${showSources ? "up" : "down"}`}></i>
          Sources ({sourceLinks.length})
        </button>

        {showSources && sourceLinks.length > 0 && (
          <div className="pl-4 space-y-2 animate-fade-in">
            {sourceLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-400 hover:text-blue-300 transition-colors truncate"
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                {link}
              </a>
            ))}
          </div>
        )}

        {showSources && sourceLinks.length === 0 && (
          <div className="text-gray-400 italic">No sources available</div>
        )}
      </div>
    </div>
  );
}
