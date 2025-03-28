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
  const createSearchParamsString = (params, category) => {
    // Create a new URLSearchParams object from the current params
    const newSearchParams = new URLSearchParams(params.toString());

    // Remove the category parameter if it exists
    newSearchParams.delete("category");

    // Add category if it's not "All Categories"
    if (category !== "All Categories") {
      newSearchParams.set("category", category);
    }

    return newSearchParams.toString();
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => {
        // Convert searchParams to URLSearchParams if it isn't already
        const searchParamsObj =
          searchParams instanceof URLSearchParams
            ? searchParams
            : new URLSearchParams(searchParams);

        const searchParamsString = createSearchParamsString(
          searchParamsObj,
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
