// components/SortSelector.jsx
import Link from "next/link";

export default function SortSelector({ selected, searchParams }) {
  const options = [
    { value: "highest", label: "Highest First" },
    { value: "lowest", label: "Lowest First" },
  ];

  const createSearchParamsString = (params, sortValue) => {
    const currentParams = Object.fromEntries(
      Object.entries(params).filter(([key]) => key !== "sort")
    );

    currentParams.sort = sortValue;
    return new URLSearchParams(currentParams).toString();
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-gray-300 text-sm">Sort by:</span>
      {options.map((option) => {
        const searchParamsString = createSearchParamsString(
          searchParams,
          option.value
        );

        return (
          <Link
            key={option.value}
            href={`/leaderboard?${searchParamsString}`}
            className={`px-4 py-2 rounded-full text-sm ${
              selected === option.value
                ? "bg-[#22c55e] text-black"
                : "bg-[#112240] text-gray-300 hover:bg-[#1d3a6e]"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
