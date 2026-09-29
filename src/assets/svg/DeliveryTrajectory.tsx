export default function DeliveryTrajectory() {
  return (
    <svg
      width="100%"
      height="246"
      viewBox="0 0 566 246"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Curved dotted path */}
      <path
        d="M48 165
           C100 165 133 145 166 116
           C199 87 229 77 276 78
           C328 79 357 88 394 111"
        stroke="#3158B8"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="1 14"
      />

      {/* Starting circle */}
      <circle
        cx="48"
        cy="165"
        r="10"
        stroke="#FF6A2D"
        strokeWidth="4"
        fill="none"
      />

      {/* Orange point */}
      <circle
        cx="276"
        cy="78"
        r="8"
        fill="#FF6A2D"
      />

      {/* Motion lines */}
      <path
        d="M408 89H432"
        stroke="#FF6A2D"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M408 105H432"
        stroke="#FF6A2D"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M408 121H432"
        stroke="#FF6A2D"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Orange rounded square */}
      <rect
        x="454"
        y="78"
        width="73"
        height="73"
        rx="17"
        fill="#FF6A2D"
      />

      {/* Package */}
      <path
        d="M475 101L490.5 94L506 101L490.5 109L475 101Z"
        stroke="#111111"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M475 101V119L490.5 127L506 119V101"
        stroke="#111111"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M490.5 109V127"
        stroke="#111111"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}