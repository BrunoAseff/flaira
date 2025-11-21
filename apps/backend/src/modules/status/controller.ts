import type { Context } from 'hono';
import { getDatabaseStatus } from './service';
import { getBody, getHeaders, getResponse } from '@/utils/http';
import { logger } from '@/utils/logger';

export const getStatus = async (context: Context) => {
  try {
    const result = await getDatabaseStatus();

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    logger.error({ error }, 'Failed to get status');

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};
