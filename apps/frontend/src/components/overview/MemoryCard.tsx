import { useState, useRef, useMemo } from 'react';
import { ImageNotFound01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import type { Memory } from '@/types/routes';

interface MemoryCardProps {
  memories: Memory[] | null | undefined;
}

export default function MemoryCard({ memories }: MemoryCardProps) {
  const [api, setApi] = useState<CarouselApi>();

  const plugin = useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: true }),
    []
  );

  const hasMemories = memories && memories.length > 0;

  const hasMultipleMemories = memories && memories.length > 1;

  return (
    <section className="rounded-lg border border-accent overflow-hidden bg-card">
      {hasMemories ? (
        <Carousel
          setApi={setApi}
          plugins={hasMultipleMemories ? [plugin] : []}
          opts={{
            loop: true,
            watchDrag: false,
          }}
          onMouseEnter={plugin.stop}
          onMouseLeave={plugin.reset}
          className="w-full"
        >
          <CarouselContent>
            {memories.map((memory) => {
              const tripYear = new Date(memory.startDate).getFullYear();

              return (
                <CarouselItem key={memory.id}>
                  <div className="relative min-h-[400px] w-full flex items-center justify-center overflow-hidden rounded-lg group">
                    <img
                      src={memory.url}
                      alt={memory.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <ProgressiveBlur
                      direction="bottom"
                      className="pointer-events-none absolute inset-0"
                      blurIntensity={0.5}
                    />

                    <div className="absolute bottom-0 left-0 p-6 w-full z-10 flex flex-col items-start text-left">
                      <h3 className="text-background font-bold text-2xl tracking-tight drop-shadow-md">
                        {memory.title}
                      </h3>
                      <span className="text-background/90 text-sm font-medium drop-shadow-md">
                        {tripYear}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="relative min-h-[400px] flex items-center justify-center">
          <img
            src="/no-memories-placeholder.jpg"
            alt=""
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
              <h2 className="text-background font-semibold text-2xl">
                You have no memories
              </h2>
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
