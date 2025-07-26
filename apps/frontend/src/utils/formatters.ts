import { formatDuration, intervalToDuration } from 'date-fns';

export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }
  return `${(distanceInMeters / 1000).toFixed(1)} km`;
}

export function formatTravelDuration(durationInSeconds: number): string {
  if (durationInSeconds < 60) {
    return 'Less than a minute';
  }

  const duration = intervalToDuration({
    start: 0,
    end: durationInSeconds * 1000,
  });

  return formatDuration(duration, {
    format: ['days', 'hours', 'minutes'],
    zero: false,
  });
}
