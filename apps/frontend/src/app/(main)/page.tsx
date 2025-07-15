'use client';

import ErrorPage from '@/components/pages/ErrorPage';
import LoadingPage from '@/components/pages/LoadingPage';
import useAuth from '@/hooks/use-auth';

export default function Home() {
  const { session, isPending, error } = useAuth();

  if (isPending || !session) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh p-5">
      <main className="flex flex-col gap-[32px] w-full">Overview</main>
    </div>
  );
}
