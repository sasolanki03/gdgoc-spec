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
        viewBox="0 0 108 72"
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-24 md:w-32 md:h-32"
        fill="none"
      >
        <g className="g-left">
            <path
                fill="#EA4335"
                d="M21.579 50.842 1.284 36l20.295-14.842L36 36l-14.421 14.842Z"
            />
            <path
                fill="#4285F4"
                d="M36 36 21.579 21.158 1.284 36l20.295 14.842L36 36Z"
            />
        </g>
        <g className="g-right">
            <path
                fill="#34A853"
                d="M86.421 21.158 106.716 36 86.42 50.842 72 36l14.42-14.842Z"
            />
            <path
                fill="#FBBC04"
                d="m72 36 14.421 14.842L106.716 36 86.421 21.158 72 36Z"
            />
        </g>
      </svg>
    </div>
  );
}
