export default function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width="100%"
      height="100%"
    >
      <rect
        x="50"
        y="50"
        width="400"
        height="400"
        rx="90"
        ry="90"
        fill="#F26E2C"
      />

      <g
        stroke="#1A1C38"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <polygon points="250,130 350,188 350,303 250,361 150,303 150,188" />

        <path d="M 250,245 L 250,361" />
        <path d="M 250,245 L 150,188" />
        <path d="M 250,245 L 350,188" />
      </g>
    </svg>
  );
}