'use client';

import ErrorPage from '@/components/pages/ErrorPage';
import LoadingPage from '@/components/pages/LoadingPage';
import Overview from '@/components/pages/Overview';
import useAuth from '@/hooks/use-auth';

export default function Home() {
  const { session, isPending, error } = useAuth();

  if (isPending || !session) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <main className="flex flex-col gap-[32px] w-full">
      <Overview />
    </main>
  );
}
