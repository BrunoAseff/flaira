import { ImageNotFound01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';

export default function MemoryCard({
  url,
}: {
  url: string | null | undefined;
}) {
  return (
    <section className="rounded-lg border border-accent">
      {url ? (
        <img
          src={url}
          alt="Random Memory"
          className="object-cover rounded-lg"
        />
      ) : (
        <div className="relative">
          <img
            src="/no-memories-placeholder.jpg"
            alt="Memory placeholder"
            className="object-cover rounded-lg blur-xs brightness-75"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <HugeiconsIcon
              icon={ImageNotFound01Icon}
              className="text-background"
              color="currentColor"
              strokeWidth={2}
              size={42}
            />
            <h1 className="text-background">You have no memories</h1>
            <Link
              className="text-base w-fit text-link hover:underline transition-all duration-300 font-medium"
              href="/memories"
            >
              Click here to upload your first!
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
