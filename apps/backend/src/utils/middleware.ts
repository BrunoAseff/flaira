import { getHeaders, getBody, getResponse } from '@/utils/http';
import { checkUser } from '@/utils/checkUser';
import type { Context } from 'hono';

export const middleware = async (c: Context, next: () => Promise<void>) => {
  const isValidUser = checkUser({ context: c });
  if (!isValidUser) {
    const headers = getHeaders();
    const body = getBody(401, null);
    return getResponse(c, 401, headers, body);
  }
  await next();
};
