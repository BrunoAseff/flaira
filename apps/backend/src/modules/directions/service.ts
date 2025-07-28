import { env } from '@/env';

export const getRouteDirections = async (
  coordinates: number[][],
  profile: string = 'driving'
) => {
  const coordinatesString = coordinates
    .map((coord: number[]) => `${coord[0]},${coord[1]}`)
    .join(';');

  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinatesString}`;

  const response = await fetch(
    `${url}?geometries=geojson&steps=true&access_token=${env.MAP_BOX_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`MapBox API error: ${response.statusText}`);
  }

  return await response.json();
};
