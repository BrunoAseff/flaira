import type { Context } from 'hono';
import { getRouteDirections } from './service';
import { getBody, getHeaders, getResponse } from '@/utils/http';
import type { DirectionsRequest } from './validator';
import { logger } from '@/utils/logger';

export const getDirections = async (context: Context) => {
  try {
    const { coordinates, profile } =
      (await context.req.json()) as DirectionsRequest;

    const result = await getRouteDirections(coordinates, profile);

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    logger.error({ error }, 'Failed to get directions');

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};
