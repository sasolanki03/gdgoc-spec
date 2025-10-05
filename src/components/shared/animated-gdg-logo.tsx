
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
        viewBox="0 0 43.14 26.57"
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-24 md:w-32 md:h-32"
        fill="none"
      >
        <g className="g-left">
          <path fill="#4285F4" d="M26.57 13.28v.03l-6.4 6.4h-6.89l8.6-8.6-8.6-8.6h6.89l6.4 6.4v.02l2.7-2.7V0H16.14L0 13.28l16.13 13.29h13.14V15.98l-2.7-2.7Z" />
        </g>
        <g className="g-right">
          <path fill="#0F9D58" d="m16.14 26.57 8.6-8.6-8.6-8.6v17.2Z" />
          <path fill="#DB4437" d="M16.14 0v17.2l-8.6-8.6L16.14 0Z" />
          <path fill="#F4B400" d="M43.14 6.89 34.54 15.5v-4.32l-2.5-2.5-2.7-2.7V0h13.8v6.89Z" />
          <path fill="#DB4437" d="M29.34 8.68v6.82l2.7 2.7V8.68h-2.7Z" />
        </g>
      </svg>
    </div>
  );
}
