export default function Sunny() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>맑음</title>
      <circle cx="24" cy="24" r="16" fill="url(#paint0_radial_sunny)" />
      <defs>
        <radialGradient
          id="paint0_radial_sunny"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(24 24) rotate(45) scale(22)"
        >
          <stop stopColor="oklch(var(--amber-700))" />
          <stop offset="1" stopColor="oklch(var(--tangerine-600))" />
        </radialGradient>
      </defs>
    </svg>
  );
}
