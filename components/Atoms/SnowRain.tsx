export default function SnowRain() {
  // Target effective stroke width: 4
  // Rain line: 4 (no scale)
  // Asterisk scale 0.5 -> 4 / 0.5 = 8
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>비/눈</title>
      {/* Rain Line (Left) - Moved closer to center */}
      <path
        d="M20 10L16 38"
        stroke="url(#paint0_linear_snowrain)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Asterisk (Right) - Moved closer to center */}
      <g transform="translate(20 20) scale(0.5)" stroke="white" strokeWidth="8" strokeLinecap="round">
        <path d="M24 8V40" />
        <path d="M10.14 16L37.86 32" />
        <path d="M10.14 32L37.86 16" />
      </g>

      <defs>
        <linearGradient
          id="paint0_linear_snowrain"
          x1="18"
          y1="10"
          x2="18"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="oklch(var(--blue-400))" />
          <stop offset="1" stopColor="oklch(var(--blue-600))" />
        </linearGradient>
      </defs>
    </svg>
  );
}
