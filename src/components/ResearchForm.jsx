"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const journalsList = [
  "PubMed Central",
  "Nature",
  "Science",
  "Cell",
  "The Lancet",
  "JAMA Network",
  "New England Journal of Medicine",
];

export default function ResearchForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    inputType: "text",
    inputData: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 409) {
        // Handle duplicate claim
        alert("This claim has already been verified for this influencer");
        router.push(`/influencer/${encodeURIComponent(formData.name)}`);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze claim");
      }

      router.push(`/influencer/${encodeURIComponent(data.influencer.name)}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Influencer Name"
          className="w-full bg-[#1a1a1a] text-white p-4 rounded-md border border-gray-700"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="flex gap-4">
          <button
            type="button"
            className={`flex-1 p-3 rounded-md ${
              formData.inputType === "text"
                ? "bg-[#22c55e] text-black"
                : "bg-[#1a1a1a] text-white"
            }`}
            onClick={() => setFormData({ ...formData, inputType: "text" })}
          >
            Enter Claim Text
          </button>
          <button
            type="button"
            className={`flex-1 p-3 rounded-md ${
              formData.inputType === "youtube"
                ? "bg-[#22c55e] text-black"
                : "bg-[#1a1a1a] text-white"
            }`}
            onClick={() => setFormData({ ...formData, inputType: "youtube" })}
          >
            YouTube Link
          </button>
        </div>

        <input
          type="text"
          placeholder={
            formData.inputType === "youtube"
              ? "Enter YouTube URL"
              : "Enter claim text"
          }
          className="w-full bg-[#1a1a1a] text-white p-4 rounded-md border border-gray-700"
          value={formData.inputData}
          onChange={(e) =>
            setFormData({ ...formData, inputData: e.target.value })
          }
          required
        />

        {/* Decorative scrolling journals */}
        <div className="overflow-hidden py-4 bg-[#1d3a6e]">
          <div className="flex animate-scroll whitespace-nowrap">
            {[...journalsList, ...journalsList, ...journalsList].map(
              (journal, i) => (
                <span key={i} className="inline-block px-8 text-white">
                  {journal}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#22c55e] text-black p-4 rounded-md hover:bg-[#1b9e4b] transition-colors"
      >
        Analyze
      </button>
    </form>
  );
}
