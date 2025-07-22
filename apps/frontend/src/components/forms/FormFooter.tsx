import { CardFooter } from '../ui/card';
import Link from 'next/link';
import type { Route } from 'next';

interface FormFooterProps<T extends string> {
  cta: string;
  href: Route<T> | URL;
}

export function FormFooter<T extends string>({
  cta,
  href,
}: FormFooterProps<T>) {
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
