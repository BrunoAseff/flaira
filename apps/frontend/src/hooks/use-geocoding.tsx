import { useState, useCallback, useRef } from 'react';

interface GeocodingResult {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  address?: string;
}

export function useGeocoding() {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
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
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?` +
          new URLSearchParams({
            key: process.env.NEXT_PUBLIC_MAPTILER_KEY!,
            autocomplete: 'true',
            limit: '5',
            types:
              'country,region,postal_code,municipality,locality,neighbourhood,place,address,poi',
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

  return { results, loading, search, clearResults };
}
