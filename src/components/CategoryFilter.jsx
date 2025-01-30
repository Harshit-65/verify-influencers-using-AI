"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const categories = [
  { id: "all", label: "All Categories" },
  { id: "Nutrition", label: "Nutrition" },
  { id: "Medicine", label: "Medicine" },
  { id: "Mental Health", label: "Mental Health" },
  { id: "Fitness", label: "Fitness" },
];

export function CategoryFilter({ selected = "all" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      if (value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (category) => {
    const query = createQueryString("category", category);
    router.push(`/leaderboard${query ? `?${query}` : ""}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              selected === category.id || (category.id === "all" && !selected)
                ? "bg-[#22c55e] text-white"
                : "bg-[#112240] text-gray-300 hover:bg-[#1d3a6e]"
            }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
