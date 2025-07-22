import { CardFooter } from '../ui/card';
import Link from 'next/link';
import type { Route } from 'next';

interface FormFooterProps {
  cta: string;
  href: Route | URL;
}

export function FormFooter({ cta, href }: FormFooterProps) {
  return (
    <CardFooter className="flex flex-col w-full gap-4 place-items-center">
      <Link
        className="text-base w-fit text-link hover:underline transition-all duration-300 font-medium"
        href={href}
      >
        {cta}
      </Link>
    </CardFooter>
  );
}
