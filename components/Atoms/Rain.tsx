export default function Rain() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>비</title>
      <path
        d="M18 10L14 38"
        stroke="url(#paint0_linear_rain)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M34 10L30 38"
        stroke="url(#paint0_linear_rain)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_rain"
          x1="24"
          y1="10"
          x2="24"
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
