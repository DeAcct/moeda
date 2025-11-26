export default function Shower() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>소나기</title>
      <path
        d="M14 8L10 36"
        stroke="url(#paint0_linear_shower)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M26 12L22 40"
        stroke="url(#paint0_linear_shower)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M38 8L34 36"
        stroke="url(#paint0_linear_shower)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_shower"
          x1="24"
          y1="8"
          x2="24"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="oklch(var(--blue-500))" />
          <stop offset="1" stopColor="oklch(var(--blue-700))" />
        </linearGradient>
      </defs>
    </svg>
  );
}
