import type { Context } from 'hono';
import { getBody, getHeaders, getResponse } from '@/utils/http';
import { uploadUserAvatar, getUserAvatar, deleteUserAvatar } from './service';
import { logger } from '@/utils/logger';

export const uploadAvatar = async (context: Context) => {
  try {
    const { fileName, type } = await context.req.json();
    const result = await uploadUserAvatar({ fileName, type });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    logger.error({ error }, 'Failed to upload profile picture');

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};

export const getAvatar = async (context: Context) => {
  try {
    const key = context.req.query('key');

    if (!key) {
      const headers = getHeaders();
      const body = getBody(400, null);

      return getResponse(context, 400, headers, body);
    }
    const result = await getUserAvatar({ key });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    logger.error({ error }, 'Failed to get profile picture');

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};

export const deleteAvatar = async (context: Context) => {
  try {
    const key = context.req.query('key');

    if (!key) {
      const headers = getHeaders();
      const body = getBody(400, null, new Error('Missing required field: key'));
      return getResponse(context, 400, headers, body);
    }
    const result = await deleteUserAvatar({ key });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    logger.error({ error }, 'Failed to delete profile picture');

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};
