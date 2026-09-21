/** Banner atas halaman menu: motif geometris, tanpa foto. */
export default function StoreCover() {
  return (
    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-500 to-[#d3803a] sm:h-44">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="motif"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <path
              d="M28 6l10 22H18zM28 50L18 28h20z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <circle cx="28" cy="28" r="2.5" fill="#ffffff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#motif)" />
      </svg>
    </div>
  );
}
