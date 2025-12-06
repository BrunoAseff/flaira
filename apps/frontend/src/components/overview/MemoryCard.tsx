import { ImageNotFound01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { Button } from '../ui/button';

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
        <div className="relative min-h-[400px] flex items-center justify-center">
          <img
            src="/no-memories-placeholder.jpg"
            alt=""
            role="presentation"
            className="absolute inset-0 object-cover rounded-lg w-full h-full"
          />
          <ProgressiveBlur
            direction="bottom"
            className="pointer-events-none absolute inset-0 rounded-lg"
            blurIntensity={2}
          />
          <div className="absolute inset-0 bg-foreground/40 rounded-lg" />

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <HugeiconsIcon
                icon={ImageNotFound01Icon}
                className="text-background/80"
                color="currentColor"
                strokeWidth={2}
                size={24}
              />
              <h1 className="text-background font-semibold text-2xl">
                You have no memories
              </h1>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/memories">Click here to upload your first!</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
