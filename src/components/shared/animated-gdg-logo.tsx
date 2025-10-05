export function AnimatedGdgLogo() {
  return (
    <div className="flex items-center justify-center">
      <style>
        {`
        @keyframes pulse-blue {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes pulse-green {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes pulse-yellow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes pulse-red {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        .g-blue { animation: pulse-blue 4s ease-in-out infinite; }
        .g-green { animation: pulse-green 4s ease-in-out infinite 0.5s; }
        .g-yellow { animation: pulse-yellow 4s ease-in-out infinite 1s; }
        .g-red { animation: pulse-red 4s ease-in-out infinite 1.5s; }
        `}
      </style>
      <svg
        width="120"
        height="120"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-24 md:w-32 md:h-32"
      >
        <g transform="translate(1,1)">
          <path
            className="g-blue"
            fill="#4285F4"
            d="M22,11.08V12a10,10,0,1,1-5.93-9.14"
            stroke="#4285F4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
          />
          <path
            className="g-green"
            fill="#34A853"
            d="M22,4.18V12a10,10,0,1,1-5.93-9.14"
            stroke="#34A853" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
          />
          <path
            className="g-yellow"
            fill="#FBBC04"
            d="M10.59,2.82V12a10,10,0,1,1-5.93-9.14"
            stroke="#FBBC04" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
          />
          <path
            className="g-red"
            fill="#EA4335"
            d="M22,11.08V12a10,10,0,1,1-5.93-9.14"
            stroke="#EA4335" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
