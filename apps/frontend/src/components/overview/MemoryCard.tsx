import { useState, useEffect } from 'react';
import { ImageNotFound01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import type { Memory } from '@/types/routes';

interface MemoryCardProps {
  memories: Memory[] | null | undefined;
}

const AUTOPLAY_DELAY = 16000;

export default function MemoryCard({ memories }: MemoryCardProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [progressKey, setProgressKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setProgressKey((prev) => prev + 1);
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const hasMemories = memories && memories.length > 0;
  const hasMultipleMemories = memories && memories.length > 1;

  const handleAnimationEnd = () => {
    if (api && !isHovered) {
      api.scrollNext();
    }
  };

  return (
    <section className="rounded-lg border border-accent overflow-hidden bg-card">
      {hasMemories ? (
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            watchDrag: false,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full relative group/carousel"
        >
          <CarouselContent>
            {memories.map((memory) => {
              const tripYear = new Date(memory.startDate).getFullYear();

              return (
                <CarouselItem key={memory.id}>
                  <div className="relative min-h-[400px] w-full flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                      src={memory.url}
                      alt={memory.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover/carousel:scale-105"
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

          {hasMultipleMemories && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-foreground/20 z-30">
              <div
                key={progressKey}
                onAnimationEnd={handleAnimationEnd}
                className="h-full bg-background origin-left shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                style={{
                  animation: `progress-loop ${AUTOPLAY_DELAY}ms linear forwards`,
                  animationPlayState: isHovered ? 'paused' : 'running',
                }}
              />
            </div>
          )}

          {hasMultipleMemories && (
            <>
              <CarouselPrevious
                variant="ghost"
                size={null}
                className="absolute left-0 inset-y-0 h-full w-20 m-0 translate-y-0 rounded-none border-none hover:bg-transparent text-background/50 hover:text-background hover:cursor-pointer transition-colors z-20 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100"
              >
                <ChevronLeft className="size-8" />
              </CarouselPrevious>

              <CarouselNext
                variant="ghost"
                size={null}
                className="absolute right-0 inset-y-0 h-full w-20 m-0 translate-y-0 rounded-none border-none hover:bg-transparent text-background/50 hover:text-background hover:cursor-pointer transition-colors z-20 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100"
              >
                <ChevronRight className="size-8" />
              </CarouselNext>
            </>
          )}
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

      <style jsx global>{`
        @keyframes progress-loop {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}
