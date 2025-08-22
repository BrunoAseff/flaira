import type { Context } from 'hono';
import { getBody, getHeaders, getResponse } from '@/utils/http';
import {
  createTrip,
  uploadTripMemory,
  getTripMemory,
  deleteTripMemory,
} from './service';
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

export const uploadMemory = async (context: Context) => {
  try {
    const user = context.get('user');
    const { fileName, type } = await context.req.json();
    const result = await uploadTripMemory({ fileName, type, userId: user.id });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    console.error('Failed to get memory upload URL', error);

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};

export const getMemory = async (context: Context) => {
  try {
    const user = context.get('user') as { id?: string } | undefined;
    if (!user?.id) {
      const headers = getHeaders();
      const body = getBody(401, null, new Error('Unauthorized'));
      return getResponse(context, 401, headers, body);
    }
    const key = context.req.query('key');
    if (!key) {
      const headers = getHeaders();
      const body = getBody(400, null, new Error('Missing required field: key'));
      return getResponse(context, 400, headers, body);
    }
    if (!key.startsWith(`memories/${user.id}/`)) {
      const headers = getHeaders();
      const body = getBody(
        403,
        null,
        new Error('Forbidden: key does not belong to the authenticated user')
      );
      return getResponse(context, 403, headers, body);
    }

    const result = await getTripMemory({ key });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    console.error('Failed to get memory', error);

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};

export const deleteMemory = async (context: Context) => {
  try {
   const user = context.get('user') as { id?: string } | undefined;
   if (!user?.id) {
     const headers = getHeaders();
     const body = getBody(401, null, new Error('Unauthorized'));
     return getResponse(context, 401, headers, body);
   }
   const key = context.req.query('key');
   if (!key) {
     const headers = getHeaders();
     const body = getBody(400, null, new Error('Missing required field: key'));
     return getResponse(context, 400, headers, body);
   }
   if (!key.startsWith(`memories/${user.id}/`)) {
     const headers = getHeaders();
     const body = getBody(403, null, new Error('Forbidden: key does not belong to the authenticated user'));
     return getResponse(context, 403, headers, body);
   }
    const result = await deleteTripMemory({ key });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    console.error('Failed to delete memory', error);

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};
