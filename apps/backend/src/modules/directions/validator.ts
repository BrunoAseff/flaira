import { z } from 'zod';

const VALID_PROFILES = ['driving', 'walking', 'cycling'] as const;

const MAX_WAYPOINTS = 25;
const MIN_WAYPOINTS = 2;

const longitudeSchema = z
  .number()
  .min(-180, 'Longitude must be between -180 and 180')
  .max(180, 'Longitude must be between -180 and 180')
  .finite('Longitude must be a finite number');

const latitudeSchema = z
  .number()
  .min(-90, 'Latitude must be between -90 and 90')
  .max(90, 'Latitude must be between -90 and 90')
  .finite('Latitude must be a finite number');

const coordinateSchema = z
  .array(z.number())
  .length(
    2,
    'Each coordinate must have exactly 2 elements [longitude, latitude]'
  )
  .transform(([lng, lat]) => [lng, lat] as [number, number])
  .pipe(z.tuple([longitudeSchema, latitudeSchema]));

export const directionsRequestSchema = z.object({
  coordinates: z
    .array(coordinateSchema)
    .min(
      MIN_WAYPOINTS,
      `At least ${MIN_WAYPOINTS} coordinates required for routing`
    )
    .max(MAX_WAYPOINTS, `Maximum ${MAX_WAYPOINTS} waypoints allowed`)
    .refine(
      (coords) => {
        for (let i = 0; i < coords.length - 1; i++) {
          const [lng1, lat1] = coords[i];
          const [lng2, lat2] = coords[i + 1];
          if (lng1 === lng2 && lat1 === lat2) {
            return false;
          }
        }
        return true;
      },
      {
        message: 'Consecutive duplicate coordinates are not allowed',
      }
    ),
  profile: z
    .enum(VALID_PROFILES, {
      errorMap: () => ({
        message: `Profile must be one of: ${VALID_PROFILES.join(', ')}`,
      }),
    })
    .default('driving'),
});

export type DirectionsRequest = z.infer<typeof directionsRequestSchema>;
export type Coordinate = z.infer<typeof coordinateSchema>;
export type Profile = z.infer<typeof directionsRequestSchema>['profile'];
