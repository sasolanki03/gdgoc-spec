import type { SVGProps } from 'react';

export function GoogleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 108 72"
      fill="none"
      {...props}
    >
      <path
        fill="#EA4335"
        d="M21.579 50.842 1.284 36l20.295-14.842L36 36l-14.421 14.842Z"
      />
      <path
        fill="#4285F4"
        d="M36 36 21.579 21.158 1.284 36l20.295 14.842L36 36Z"
      />
      <path
        fill="#34A853"
        d="M86.421 21.158 106.716 36 86.42 50.842 72 36l14.42-14.842Z"
      />
      <path
        fill="#FBBC04"
        d="m72 36 14.421 14.842L106.716 36 86.421 21.158 72 36Z"
      />
    </svg>
  );
}
