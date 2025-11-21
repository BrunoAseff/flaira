import type { Context } from 'hono';
import { getBody, getHeaders, getResponse } from '@/utils/http';
import {
  uploadTripMemory,
  getTripMemory,
  deleteTripMemory,
  getRandomTripMemories,
} from './service';
import { logger } from '@/utils/logger';

export const uploadMemory = async (context: Context) => {
  try {
    const user = context.get('user');
    const { fileName, type } = await context.req.json();
    const result = await uploadTripMemory({ fileName, type, userId: user.id });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    logger.error({ error }, 'Failed to get memory upload URL');

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};

export const getMemory = async (context: Context) => {
  try {
    const user = context.get('user');
    const key = context.req.query('key');

    if (!key) {
      const headers = getHeaders();
      const body = getBody(400, null, new Error('Missing required field: key'));
      return getResponse(context, 400, headers, body);
    }

    const result = await getTripMemory({ key });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    logger.error({ error }, 'Failed to get memory');

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};

export const getRandomMemories = async (context: Context) => {
  try {
    const user = context.get('user');

    const result = await getRandomTripMemories({ userId: user.id });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    logger.error({ error }, 'Failed to get random memories');

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};

export const deleteMemory = async (context: Context) => {
  try {
    const user = context.get('user');

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
    const result = await deleteTripMemory({ key, userId: user.id });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    logger.error({ error }, 'Failed to delete memory');

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};
