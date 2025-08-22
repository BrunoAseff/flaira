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
  estimatedDuration: z.number().nonnegative(),
  estimatedDistance: z.number().nonnegative(),
  locations: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        coordinates: z.tuple([z.number(), z.number()]),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
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

const toValidation = <I, O>(r: z.SafeParseReturnType<I, O>) =>
  r.success
    ? { isValid: true, errors: [] as string[] }
    : { isValid: false, errors: r.error.issues.map((i) => i.message) };

export const validateTripDetails = (
  details: z.input<typeof tripDetailsSchema>
) => toValidation(tripDetailsSchema.safeParse(details));

export const validateTripRoute = (route: z.input<typeof tripRouteSchema>) =>
  toValidation(tripRouteSchema.safeParse(route));

export const validateTripTravelers = (
  travelers: z.input<typeof tripTravelersSchema>
) => {
  const parsed = tripTravelersSchema.safeParse(travelers);
  if (!parsed.success) {
    return {
      isValid: false,
      errors: parsed.error.issues.map((i) => i.message),
    };
  }

  const users = parsed.data.users ?? [];
  if (users.length === 0) {
    return { isValid: true, errors: [] };
  }

  const missingIdx = users
    .map((u, i) => ({ i, email: typeof u.email === 'string' ? u.email : '' }))
    .filter(({ email }) => email.trim().length === 0)
    .map(({ i }) => i + 1);
  if (missingIdx.length > 0) {
    return {
      isValid: false,
      errors: [
        `All travelers must have an email address (missing for: ${missingIdx.join(', ')})`,
      ],
    };
  }

  const invalidIdx = users
    .map((u, i) => ({ i, email: u.email.trim() }))
    .filter(({ email }) => !emailSchema.safeParse(email).success)
    .map(({ i }) => i + 1);
  if (invalidIdx.length > 0) {
    return {
      isValid: false,
      errors: [
        `Invalid email address for traveler(s): ${invalidIdx.join(', ')}`,
      ],
    };
  }

  return { isValid: true, errors: [] };
};
