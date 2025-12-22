import { auth } from '@/auth/client';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { Memory } from '@/types/routes';
import MemoryCard from '../overview/MemoryCard';
import Greeting from '../overview/Greeting';
import MapCard from '../overview/MapCard';
import TripCard from '../overview/TripCard';
import LogbookCard from '../overview/LogbookCard';

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
        return response.data;
      }

      return null;
    },
  });

  return (
    <div className="flex flex-col p-6">
      {session?.user.name && <Greeting username={session?.user.name} />}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mt-12 w-full">
        <MemoryCard memories={data} />
        <TripCard />
        <MapCard />
      </div>
    </div>
  );
}
