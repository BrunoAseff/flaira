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
    <div className="flex flex-col p-6 mt-12 md:mt-0">
      {session?.user.name && <Greeting username={session?.user.name} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 [@media(min-width:2000px)]:grid-cols-4 auto-rows-[350px] gap-12 p-2 mt-12 w-full">
        <MemoryCard memories={data} />
        <TripCard />
        <LogbookCard />
        <MapCard />
      </div>
    </div>
  );
}
