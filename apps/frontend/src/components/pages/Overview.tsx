import { auth } from '@/auth/client';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { Memory } from '@/types/routes';
import { ImageNotFound01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';

function MemoryCard({ url }: { url: string | null | undefined }) {
  return (
    <section className="m-12 rounded-lg border border-accent">
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

export default function Overview() {
  const { data: session } = auth.useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ['random-memory', session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const response = await api.get<Memory[]>('/memory/get-random-memories', {
        auth: true,
      });

      if (response.ok && response.data && response.data.length) {
        return response.data[0].url;
      }

      return null;
    },
  });

  return (
    <div className="grid grid-cols-3 gap-12">
      <MemoryCard url={data} />
    </div>
  );
}
