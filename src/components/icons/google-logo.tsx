
import type { SVGProps } from 'react';

export function GoogleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 43.14 26.57"
      fill="none"
      {...props}
    >
      <path fill="#4285F4" d="M26.57 13.28v.03l-6.4 6.4h-6.89l8.6-8.6-8.6-8.6h6.89l6.4 6.4v.02l2.7-2.7V0H16.14L0 13.28l16.13 13.29h13.14V15.98l-2.7-2.7Z" />
      <path fill="#0F9D58" d="m16.14 26.57 8.6-8.6-8.6-8.6v17.2Z" />
      <path fill="#DB4437" d="M16.14 0v17.2l-8.6-8.6L16.14 0Z" />
      <path fill="#F4B400" d="M43.14 6.89 34.54 15.5v-4.32l-2.5-2.5-2.7-2.7V0h13.8v6.89Z" />
      <path fill="#DB4437" d="M29.34 8.68v6.82l2.7 2.7V8.68h-2.7Z" />
    </svg>
  );
}
