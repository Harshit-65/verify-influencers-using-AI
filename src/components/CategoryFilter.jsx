// components/CategoryFilter.jsx
import Link from "next/link";

const categories = [
  "All Categories",
  "Nutrition",
  "Medicine",
  "Mental Health",
  "Fitness",
];

export default function CategoryFilter({ selected, searchParams }) {
  // Convert searchParams to a string format that URLSearchParams can use
  const createSearchParamsString = (params, category) => {
    // Create a new object from the current searchParams
    const currentParams = Object.fromEntries(
      Object.entries(params).filter(([key]) => key !== "category")
    );

    // Add category if it's not "All Categories"
    if (category !== "All Categories") {
      currentParams.category = category;
    }

    // Convert to URLSearchParams string
    return new URLSearchParams(currentParams).toString();
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => {
        const searchParamsString = createSearchParamsString(
          searchParams,
          category
        );

        return (
          <Link
            key={category}
            href={`/leaderboard${
              searchParamsString ? `?${searchParamsString}` : ""
            }`}
            className={`px-4 py-2 rounded-full text-sm ${
              selected === category ||
              (category === "All Categories" && !selected)
                ? "bg-[#22c55e] text-black"
                : "bg-[#112240] text-gray-300 hover:bg-[#1d3a6e]"
            }`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
