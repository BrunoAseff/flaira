import type { GeocodingResult } from '@/types/route';

export const MAPBOX_DISTANCE_LIMITS = {
  driving: 4_000_000,
  'driving-traffic': 4_000_000,
  cycling: 1_000_000,
  walking: 1_000_000,
} as const;

const EARTH_RADIUS_METERS = 6371000;

const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

function calculateHaversineDistance(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number
): number {
  const latitudeDifferenceRadians = degreesToRadians(toLatitude - fromLatitude);
  const longitudeDifferenceRadians = degreesToRadians(
    toLongitude - fromLongitude
  );

  const fromLatitudeRadians = degreesToRadians(fromLatitude);
  const toLatitudeRadians = degreesToRadians(toLatitude);

  const haversineValue =
    Math.sin(latitudeDifferenceRadians / 2) ** 2 +
    Math.cos(fromLatitudeRadians) *
      Math.cos(toLatitudeRadians) *
      Math.sin(longitudeDifferenceRadians / 2) ** 2;

  const centralAngle =
    2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

  return EARTH_RADIUS_METERS * centralAngle;
}

const sumSegmentDistances = (
  coordinates: [number, number][],
  index: number = 0,
  total: number = 0
): number => {
  if (index >= coordinates.length - 1) {
    return total;
  }

  const [fromLng, fromLat] = coordinates[index];
  const [toLng, toLat] = coordinates[index + 1];

  const distance = calculateHaversineDistance(fromLat, fromLng, toLat, toLng);

  return sumSegmentDistances(coordinates, index + 1, total + distance);
};

export const calculateTotalApproximateDistance = (
  coordinates: [number, number][]
): number => {
  if (coordinates.length < 2) {
    return 0;
  }

  return sumSegmentDistances(coordinates);
};

export const getMaxDistanceForProfile = (profile: string): number => {
  return (
    MAPBOX_DISTANCE_LIMITS[profile as keyof typeof MAPBOX_DISTANCE_LIMITS] ||
    MAPBOX_DISTANCE_LIMITS.driving
  );
};

export const isRouteWithinLimits = (
  coordinates: [number, number][],
  profile: string
): boolean => {
  const distance = calculateTotalApproximateDistance(coordinates);
  const maxDistance = getMaxDistanceForProfile(profile);
  return distance <= maxDistance;
};

export const extractLocationDetails = (
  result: GeocodingResult
): { country: string; city: string } => {
  let country = '';
  let city = '';

  const types = result.place_type ?? [];
  const contexts = result.context ?? [];
  const findCtx = (prefix: string) =>
    contexts.find((ctx) => ctx.id.startsWith(prefix));

  if (types.includes('country')) {
    country = result.text || result.place_name;
  } else if (types.includes('place') || types.includes('locality')) {
    city = result.text || result.place_name.split(',')[0];
    country = findCtx('country.')?.text || '';
  } else {
    const cityFromCtx =
      findCtx('place.')?.text || findCtx('locality.')?.text || '';
    city = cityFromCtx || result.text || result.place_name.split(',')[0];
    country = findCtx('country.')?.text || '';
  }

  if (!country && result.place_name.includes(',')) {
    const parts = result.place_name.split(',').map((part) => part.trim());
    if (parts.length >= 2) {
      country = parts[parts.length - 1];
      if (!city && parts.length >= 3) {
        city = parts[0];
      }
    }
  }

  if (!country) {
    const cc = findCtx('country.')?.short_code;
    if (cc) country = cc.toUpperCase();
  }

  return { country: country.trim(), city: city.trim() };
};
