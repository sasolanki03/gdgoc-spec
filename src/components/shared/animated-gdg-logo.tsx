
export function AnimatedGdgLogo() {
  return (
    <div className="flex items-center justify-center">
      <style>
        {`
        @keyframes pulse-left {
          0%, 100% { transform: translateX(0) scale(1); opacity: 1; }
          50% { transform: translateX(-5px) scale(1.05); opacity: 0.9; }
        }
        @keyframes pulse-right {
          0%, 100% { transform: translateX(0) scale(1); opacity: 1; }
          50% { transform: translateX(5px) scale(1.05); opacity: 0.9; }
        }
        .g-left { animation: pulse-left 4s ease-in-out infinite; }
        .g-right { animation: pulse-right 4s ease-in-out infinite 0.5s; }
        `}
      </style>
      <svg
        width="120"
        height="120"
        viewBox="0 0 208 110"
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-24 md:w-32 md:h-32"
        fill="none"
      >
        <g className="g-left">
            <path d="M74.629 1.93359e-05L9.13898 33.35L74.629 66.7L60.039 80.85L16.089 54.1L0.638977 66.7L0.638977 44.45L37.389 22.2L0.638977 0L74.629 1.93359e-05Z" fill="#EA4335"/>
            <path d="M74.625 110L9.13501 76.65L74.625 43.3L60.035 29.15L16.085 55.9L0.63501 43.3V65.55L37.385 87.8L0.63501 110H74.625Z" fill="#4285F4"/>
        </g>
        <g className="g-right">
            <path d="M133 110L207.5 76.65L133 43.3L147.59 29.15L191.54 55.9L207 43.3V65.55L169.75 87.8L207 110H133Z" fill="#34A853"/>
            <path d="M133 0L207.5 33.35L133 66.7L147.59 80.85L191.54 54.1L207 66.7V44.45L169.75 22.2L207 0H133Z" fill="#FBBC04"/>
        </g>
      </svg>
    </div>
  );
}
