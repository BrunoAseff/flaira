import type { Context } from 'hono';
import { getBody, getHeaders, getResponse } from '@/utils/http';
import { createTrip } from './service';
import type { CreateTripInput } from './validator';

export const addTrip = async (context: Context) => {
  try {
    const user = context.get('user');
    const tripData: CreateTripInput = await context.req.json();
    const result = await createTrip(tripData, user.id);

    const headers = getHeaders();
    const body = getBody(201, result);

    return getResponse(context, 201, headers, body);
  } catch (error) {
    console.error('Failed to create trip', error);

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};
