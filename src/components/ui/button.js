export function Button({ children, className, variant = "default", ...props }) {
  const baseStyles = "px-4 py-2 rounded-lg font-roboto transition-colors";
  const variants = {
    default: "bg-[#22c55e] text-white hover:bg-[#1ea34b]",
    outline: "border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
