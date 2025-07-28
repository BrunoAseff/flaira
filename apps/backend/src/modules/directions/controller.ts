import type { Context } from 'hono';
import { getRouteDirections } from './service';
import { getBody, getHeaders, getResponse } from '@/utils/http';

export const getDirections = async (context: Context) => {
  try {
    const { coordinates, profile = 'driving' } = await context.req.json();

    const result = await getRouteDirections(coordinates, profile);

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    console.error('Failed to get directions', error);

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};
