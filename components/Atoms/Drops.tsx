export default function Drops() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>빗방울</title>
      <path
        d="M24 6C24 6 10 24 10 33C10 40.732 16.268 47 24 47C31.732 47 38 40.732 38 33C38 24 24 6 24 6Z"
        fill="url(#paint0_linear_drops)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_drops"
          x1="24"
          y1="6"
          x2="24"
          y2="47"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="oklch(var(--blue-300))" />
          <stop offset="1" stopColor="oklch(var(--blue-500))" />
        </linearGradient>
      </defs>
    </svg>
  );
}
