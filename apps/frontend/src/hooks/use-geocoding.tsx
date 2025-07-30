import { useState, useCallback, useRef } from 'react';

interface GeocodingResult {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  properties: {
    address?: string;
    category?: string;
  };
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

export function useGeocoding() {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          new URLSearchParams({
            access_token: process.env.NEXT_PUBLIC_MAPBOX_KEY!,
            autocomplete: 'true',
            limit: '5',
            types:
              'country,region,postcode,district,place,locality,neighborhood,address,poi',
          }),
        { signal: abortController.current.signal }
      );

      if (!response.ok) throw new Error('Geocoding request failed');

      const data = await response.json();
      setResults(data.features || []);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Geocoding error:', error);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  const reverseGeocode = useCallback(
    async (coordinates: [number, number]): Promise<string> => {
      setReverseLoading(true);

      try {
        const [lng, lat] = coordinates;
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
            new URLSearchParams({
              access_token: process.env.NEXT_PUBLIC_MAPBOX_KEY!,
              types: 'address,poi,place,locality,neighborhood,district,region',
              limit: '1',
            })
        );

        if (!response.ok) throw new Error('Reverse geocoding failed');

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          return data.features[0].place_name;
        }

        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        const [lng, lat] = coordinates;
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      } finally {
        setReverseLoading(false);
      }
    },
    []
  );

  return {
    results,
    loading,
    reverseLoading,
    search,
    clearResults,
    reverseGeocode,
  };
}
