export default function Snow() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>눈</title>
      <g stroke="url(#paint0_linear_snow)" strokeWidth="4" strokeLinecap="round">
        {/* Vertical */}
        <path d="M24 8V40" />
        {/* Diagonal 1 (60 degrees) */}
        <path d="M10.14 16L37.86 32" />
        {/* Diagonal 2 (-60 degrees) */}
        <path d="M10.14 32L37.86 16" />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_snow"
          x1="24"
          y1="8"
          x2="24"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="oklch(var(--blue-100))" />
        </linearGradient>
      </defs>
    </svg>
  );
}
