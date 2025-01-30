"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TimeRangeSelector from "./TimeRangeSelector";

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
    claimsCount: 50,
    journals: new Set(),
    includeRevenue: false,
    notes: "",
    selectedRange: "week",
  });

  const toggleJournal = (journal) => {
    const newJournals = new Set(formData.journals);
    newJournals.has(journal)
      ? newJournals.delete(journal)
      : newJournals.add(journal);
    setFormData({ ...formData, journals: newJournals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        journals: Array.from(formData.journals),
      }),
    });

    if (response.ok) {
      const { slug } = await response.json();
      router.push(`/influencer/${slug}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-[#112240] p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <i className="fas fa-user absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="Influencer Name"
              className="w-full bg-[#1a1a1a] text-white p-3 pl-10 rounded-md"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="relative">
            <i className="fas fa-list-ol absolute left-3 top-3 text-gray-400"></i>
            <input
              type="number"
              placeholder="Claims to Analyze"
              className="w-full bg-[#1a1a1a] text-white p-3 pl-10 rounded-md"
              value={formData.claimsCount}
              onChange={(e) =>
                setFormData({ ...formData, claimsCount: e.target.value })
              }
              min="1"
              max="100"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-gray-300 mb-2 block">Time Range</label>
          <TimeRangeSelector
            selectedRange={formData.selectedRange}
            onRangeChange={(range) =>
              setFormData({ ...formData, selectedRange: range })
            }
          />
        </div>
      </div>

      <div className="bg-[#112240] p-6 rounded-lg">
        <h3 className="text-xl font-bold font-roboto mb-4">
          Research Parameters
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={formData.includeRevenue}
                onChange={(e) =>
                  setFormData({ ...formData, includeRevenue: e.target.checked })
                }
                className="w-4 h-4 text-[#22c55e]"
              />
              <span>Include Revenue Analysis</span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-gray-300">Scientific Journals</h4>
              <div className="space-x-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      journals: new Set(journalsList),
                    })
                  }
                  className="text-[#22c55e] hover:text-white"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, journals: new Set() })
                  }
                  className="text-[#22c55e] hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {journalsList.map((journal) => (
                <label key={journal} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.journals.has(journal)}
                    onChange={() => toggleJournal(journal)}
                    className="w-4 h-4 text-[#22c55e]"
                  />
                  <span>{journal}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <textarea
            placeholder="Notes for Research Assistant"
            className="w-full bg-[#1a1a1a] text-white p-4 rounded-md border border-gray-700 resize-none"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows="4"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#22c55e] text-white px-8 py-3 rounded-lg hover:bg-[#1ea34b] transition-colors font-roboto"
        >
          Start Research
        </button>
      </div>
    </form>
  );
}
