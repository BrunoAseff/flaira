export const OPEN_ROUTE_MAX_DISTANCE_METERS = 6000000;
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
