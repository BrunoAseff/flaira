import { z } from 'zod';

export const tripLocationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Location name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(
      ([lon, lat]) => lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90,
      'Coordinates must be [lon, lat] with lon in [-180,180] and lat in [-90,90]'
    ),
});

export const tripTravelerSchema = z.object({
  id: z.number(),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
});

export const uploadMemorySchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  type: z.string().min(1, 'File type is required'),
});

export const getMemorySchema = z.object({
  key: z.string().min(1, 'S3 key is required'),
});

export const deleteMemorySchema = z.object({
  key: z.string().min(1, 'S3 key is required'),
});

export const createTripSchema = z
  .object({
    details: z.object({
      title: z.string().trim().min(1, 'Title is required'),
      description: z.string().optional().default(''),
      startDate: z.string().datetime('Invalid start date format'),
      endDate: z.string().datetime('Invalid end date format').optional(),
      hasTripFinished: z.boolean().default(false),
    }),
    route: z.object({
      transportMode: z.enum([
        'on_foot',
        'bicycle',
        'car',
        'motorbike',
        'bus',
        'plane',
        'ship',
        'boat',
        'train',
        'other',
      ]),
      estimatedDuration: z
        .number()
        .nonnegative('Duration must be non-negative'),
      estimatedDistance: z
        .number()
        .nonnegative('Distance must be non-negative'),
      locations: z
        .array(tripLocationSchema)
        .min(2, 'At least start and end locations are required')
        .superRefine((locations, ctx) => {
          const ids = locations.map((l) => l.id);
          const idSet = new Set(ids);
          if (idSet.size !== ids.length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Location IDs must be unique',
              path: [],
            });
          }
          const starts = locations.filter((l) => l.id === 'start').length;
          const ends = locations.filter((l) => l.id === 'end').length;
          if (starts !== 1 || ends !== 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Exactly one start and one end location are required',
              path: [],
            });
          }
        }),

      stops: z.array(z.object({ id: z.number() })).default([]),
    }),
    travelers: z.object({
      users: z
        .array(tripTravelerSchema)
        .default([])
        .superRefine((users, ctx) => {
          const seen = new Set<string>();
          for (const u of users) {
            const e = u.email.toLowerCase();
            if (seen.has(e)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Duplicate traveler email: ${u.email}`,
                path: [],
              });
            }
            seen.add(e);
          }
        }),
    }),
    memories: z
      .array(
        z.object({
          s3Key: z.string().min(1, 'S3 key is required'),
          type: z.enum(['image', 'video', 'audio']),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.details.endDate) {
        const startDate = new Date(data.details.startDate);
        const endDate = new Date(data.details.endDate);
        return endDate >= startDate;
      }
      return true;
    },
    {
      message: 'End date must be on or after start date',
      path: ['details', 'endDate'],
    }
  );

export type CreateTripInput = z.infer<typeof createTripSchema>;
