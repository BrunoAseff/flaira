import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Location, Route } from '../types/route';
import {
  calculateTotalApproximateDistance,
  getMaxDistanceForProfile,
} from '@/utils/routing';

export function useRouting() {
  const [queryParams, setQueryParams] = useState<{
    coordinates: number[][];
    profile: string;
  } | null>(null);

  const {
    data: route,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['directions', queryParams?.coordinates, queryParams?.profile],
    enabled: !!queryParams,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('4')) return false;
      return failureCount < 2;
    },
    queryFn: async () => {
      if (!queryParams) return null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/directions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...queryParams,
            overview: 'full',
            geometries: 'geojson',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Routing failed: ${response.statusText}`);
      }

      const data = await response.json();
      const routeData = data.data.routes[0];

      if (!routeData) {
        throw new Error('No route found');
      }

      const geometry = routeData.geometry.coordinates;
      const lngs = geometry.map((coord: [number, number]) => coord[0]);
      const lats = geometry.map((coord: [number, number]) => coord[1]);

      const route: Route = {
        segments: [
          {
            coordinates: geometry,
            distance: routeData.distance,
            duration: routeData.duration,
            instructions:
              routeData.legs[0]?.steps?.map(
                (step: any) => step.maneuver.instruction
              ) || [],
          },
        ],
        totalDistance: routeData.distance,
        totalDuration: routeData.duration,
        bounds: {
          west: Math.min(...lngs),
          east: Math.max(...lngs),
          north: Math.max(...lats),
          south: Math.min(...lats),
        },
      };

      return route;
    },
  });

  const calculateRoute = useCallback(
    (locations: Location[], transportMode: string = 'driving') => {
      if (locations.length < 2) {
        setQueryParams(null);
        return;
      }

      const coordinates = locations.map((loc) => loc.coordinates);

      const profileMap: Record<string, string> = {
        feet: 'walking',
        bicycle: 'cycling',
      };

      const getProfile = (transport: string): string => {
        return profileMap[transport] || 'driving';
      };

      const profile = getProfile(transportMode);
      const distance = calculateTotalApproximateDistance(coordinates);
      const maxDistance = getMaxDistanceForProfile(profile);

      if (distance > maxDistance) return setQueryParams(null);

      setQueryParams({ coordinates, profile });
    },
    []
  );

  const clearRoute = useCallback(() => {
    setQueryParams(null);
  }, []);

  return {
    route,
    loading,
    error,
    calculateRoute,
    clearRoute,
  };
}
