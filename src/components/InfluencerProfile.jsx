"use client";
import { useState } from "react";
import InfluencerCard from "@/components/InfluencerCard";
import ClaimCard from "@/components/ClaimCard";

const CLAIM_CATEGORIES = [
  "Sleep",
  "Performance",
  "Hormones",
  "Nutrition",
  "Exercise",
  "Stress",
  "Cognition",
  "Motivation",
  "Recovery",
  "Mental Health",
];

export default function InfluencerProfile({ data, className }) {
  const influencer = data;
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredClaims =
    influencer.claims
      ?.filter(
        (claim) =>
          (selectedStatus === "all" || claim.status === selectedStatus) &&
          (selectedCategory === "all" || claim.category === selectedCategory)
      )
      ?.sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.date.$date) - new Date(a.date.$date);
        }
        return b.trustScore - a.trustScore;
      }) || [];

  return (
    <div className={`${className} text-white`}>
      <InfluencerCard influencer={influencer} />
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
      {/* Filter Controls */}
      <div className="mt-8 space-y-6">
        <div>
          <div className="text-sm text-gray-400 mb-2">Categories</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === "all"
                  ? "bg-green-400 text-black"
                  : "text-white hover:bg-green-400 hover:text-black"
              }`}
            >
              All Categories
            </button>
            {CLAIM_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category
                    ? "bg-green-400 text-black"
                    : "text-white hover:bg-green-400 hover:text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-2">
              Verification Status
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedStatus === "all"
                    ? "bg-green-400 text-black"
                    : "text-white hover:bg-green-400 hover:text-black"
                }`}
              >
                All Statuses
              </button>
              <button
                onClick={() => setSelectedStatus("Verified")}
                className={`px-3 py-1 rounded-full text-sm border border-green-400 ${
                  selectedStatus === "Verified"
                    ? "bg-green-400 text-black"
                    : "text-white hover:bg-green-400 hover:text-black"
                }`}
              >
                <i
                  className={`fas fa-check-circle mr-2 ${
                    selectedStatus === "Verified"
                      ? "text-black"
                      : "text-green-400"
                  }`}
                ></i>
                Verified
              </button>
              <button
                onClick={() => setSelectedStatus("Questionable")}
                className={`px-3 py-1 rounded-full text-sm border border-yellow-400 ${
                  selectedStatus === "Questionable"
                    ? "bg-yellow-400 text-black"
                    : "text-white hover:bg-yellow-400 hover:text-black"
                }`}
              >
                <i
                  className={`fas fa-question-circle mr-2 ${
                    selectedStatus === "Questionable"
                      ? "text-black"
                      : "text-yellow-400"
                  }`}
                ></i>
                Questionable
              </button>
              <button
                onClick={() => setSelectedStatus("Debunked")}
                className={`px-3 py-1 rounded-full text-sm border border-red-400 ${
                  selectedStatus === "Debunked"
                    ? "bg-red-400 text-black"
                    : "text-white hover:bg-red-400 hover:text-black"
                }`}
              >
                <i
                  className={`fas fa-times-circle mr-2 ${
                    selectedStatus === "Debunked"
                      ? "text-black"
                      : "text-red-400"
                  }`}
                ></i>
                Debunked
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Sort By</span>
            <select
              className="bg-[#0A0B0F] text-white px-3 py-2 rounded-lg border border-gray-700"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="trustScore">Trust Score</option>
            </select>
          </div>
        </div>
      </div>
      {/* Claims List */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Claims Analysis</h2>
        <div className="space-y-4 h-64 overflow-y-auto">
          {filteredClaims.length > 0 ? (
            filteredClaims.map((claim) => (
              <ClaimCard key={claim._id?.$oid || claim._id} claim={claim} />
            ))
          ) : (
            <div className="text-gray-400 text-center py-4">
              No claims match current filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
