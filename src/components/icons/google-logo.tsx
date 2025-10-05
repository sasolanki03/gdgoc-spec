import type { SVGProps } from 'react';

export function GoogleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path
        fill="#4285f4"
        d="M386 208v-44h-44v44h-44v44h44v44h44v-44h44v-44h-44z"
      ></path>
      <path
        fill="#34a853"
        d="M448 272v104q0 14-9 23t-23 9H96q-14 0-23-9t-9-23V112q0-14 9-23t23-9h160v44H96v224h288V272h64z"
      ></path>
    </svg>
  );
}
