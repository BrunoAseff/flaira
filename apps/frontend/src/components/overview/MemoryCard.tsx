import { ImageNotFound01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

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
            alt=""
            role="presentation"
            className="object-cover rounded-lg"
          />
          <ProgressiveBlur
            direction="bottom"
            className="pointer-events-none absolute bottom-0 left-0 h-[70%] w-full rounded-lg"
            blurIntensity={1}
          />
          <div className="absolute bottom-6 right-6 flex flex-col items-end text-right">
            <HugeiconsIcon
              icon={ImageNotFound01Icon}
              className="text-background mb-2"
              color="currentColor"
              strokeWidth={2}
              size={42}
            />
            <h1 className="text-background font-bold">You have no memories</h1>
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
