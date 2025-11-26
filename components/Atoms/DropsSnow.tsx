export default function DropsSnow() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>빗방울/눈날림</title>
      <defs>
        <linearGradient
          id="paint0_linear_dropssnow"
          x1="18"
          y1="10"
          x2="18"
          y2="33"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="oklch(var(--blue-300))" />
          <stop offset="1" stopColor="oklch(var(--blue-500))" />
        </linearGradient>
      </defs>

      {/* Drop (Left) - Moved closer to center */}
      <path
        d="M18 10C18 10 10 20 10 25C10 29.295 13.482 33 17.777 33C22.072 33 25.554 29.295 25.554 25C25.554 10 18 10 18 10Z"
        fill="url(#paint0_linear_dropssnow)"
      />

      {/* Asterisk (Right) - Moved closer to center */}
      <g transform="translate(22 22) scale(0.4)" stroke="white" strokeWidth="10" strokeLinecap="round">
        <path d="M24 8V40" />
        <path d="M10.14 16L37.86 32" />
        <path d="M10.14 32L37.86 16" />
      </g>
    </svg>
  );
}
