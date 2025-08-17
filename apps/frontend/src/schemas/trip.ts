import { z } from 'zod';

export const tripDetailsSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string(),
  startDate: z
    .date({ required_error: 'Date is required' })
    .nullable()
    .refine((date) => date !== null, { message: 'Date is required' }),
  endDate: z.date().nullable().optional(),
  hasTripFinished: z.boolean(),
});

export const tripRouteSchema = z.object({
  transportMode: z.string().min(1, 'Transportation mode is required'),
  locations: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        coordinates: z.tuple([z.number(), z.number()]),
        address: z.string().optional(),
      })
    )
    .refine(
      (locations) => {
        const hasStart = locations.some((loc) => loc.id === 'start');
        const hasEnd = locations.some((loc) => loc.id === 'end');
        return hasStart && hasEnd;
      },
      { message: 'Both start and end locations are required' }
    ),
  stops: z.array(z.object({ id: z.number() })),
});

export const emailSchema = z.string().email('Invalid email address');

export const tripTravelersSchema = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      email: z.string().min(1, 'Email is required').pipe(emailSchema),
      role: z.string(),
    })
  ),
});
