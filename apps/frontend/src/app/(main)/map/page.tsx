'use client';

import LoadingPage from '@/components/pages/LoadingPage';
import ErrorPage from '@/components/pages/ErrorPage';
import useAuth from '@/hooks/use-auth';
import dynamic from 'next/dynamic';
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
});

export default function MapPage() {
  const { session, isPending, error } = useAuth();

  if (isPending || !session) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return <MapView />;
}
