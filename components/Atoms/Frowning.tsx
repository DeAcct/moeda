export default function Frowning() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>눈날림</title>
      {/* Main Asterisk (Center) */}
      <g transform="translate(14 14) scale(0.4)" stroke="white" strokeWidth="10" strokeLinecap="round">
        <path d="M24 8V40" />
        <path d="M10.14 16L37.86 32" />
        <path d="M10.14 32L37.86 16" />
      </g>
      {/* Small Asterisk (Bottom Right - Blue) */}
      <g transform="translate(28 28) scale(0.3)" stroke="oklch(var(--blue-100))" strokeWidth="13" strokeLinecap="round">
        <path d="M24 8V40" />
        <path d="M10.14 16L37.86 32" />
        <path d="M10.14 32L37.86 16" />
      </g>
       {/* Small Asterisk (Top Left - White) */}
       <g transform="translate(6 6) scale(0.3)" stroke="white" strokeWidth="13" strokeLinecap="round">
        <path d="M24 8V40" />
        <path d="M10.14 16L37.86 32" />
        <path d="M10.14 32L37.86 16" />
      </g>
    </svg>
  );
}
