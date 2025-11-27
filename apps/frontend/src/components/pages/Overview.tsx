import { auth } from '@/auth/client';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { GetRandomMemoriesResponse } from '@/types/routes';

export default function Overview() {
  const { data: session } = auth.useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ['random-memory', session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const response = await api.get<GetRandomMemoriesResponse>(
        '/memory/get-random-memories',
        {
          auth: true,
        }
      );

      if (
        response.ok &&
        response.data?.memories &&
        response.data.memories.length
      ) {
        return response.data.memories[0].url;
      }
    },
  });

  return <div>Overview</div>;
}
