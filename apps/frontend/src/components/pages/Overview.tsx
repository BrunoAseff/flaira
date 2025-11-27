import { auth } from '@/auth/client';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { Memory } from '@/types/routes';

export default function Overview() {
  const { data: session } = auth.useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ['random-memory', session?.user.image],
    queryFn: async () => {
      const response = await api.get<Memory[]>('/memory/get-random-memories', {
        auth: true,
      });

      if (response.ok && response.data && response.data.length) {
        return response.data[0].url;
      }
    },
  });

  return <div>Overview</div>;
}
