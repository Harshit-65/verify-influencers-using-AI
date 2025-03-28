// // src\components\TimeRangeSelector.jsx

// "use client";

// export default function TimeRangeSelector({ selectedRange, onRangeChange }) {
//   const ranges = [
//     { id: "week", label: "Last Week" },
//     { id: "month", label: "Last Month" },
//     { id: "year", label: "Last Year" },
//     { id: "all", label: "All Time" },
//   ];

//   return (
//     <div className="inline-flex bg-[#1a1a1a] p-1 rounded-lg">
//       {ranges.map((range) => (
//         <button
//           key={range.id}
//           type="button"
//           onClick={() => onRangeChange(range.id)}
//           className={`px-4 py-2 rounded-md text-sm transition-colors ${
//             selectedRange === range.id
//               ? "bg-[#22c55e] text-white"
//               : "text-gray-300 hover:bg-[#333333]"
//           }`}
//         >
//           {range.label}
//         </button>
//       ))}
//     </div>
//   );
// }
