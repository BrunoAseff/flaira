import { env } from '@/env';
import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  409: 'Conflict',
  413: 'Payload Too Large',
  415: 'Unsupported Media Type',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
} as const satisfies Record<number, string>;

export function getHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' };
}

export function getBody(
  statusCode: StatusCode,
  data?: unknown,
  error?: unknown
) {
 if (error || statusCode >= 400) {
   const isServerError = statusCode >= 500;
   const messageFromError =
     error instanceof Error
       ? error.message
       : typeof error === 'string'
         ? error
         : undefined;
   const message =
     isServerError || !messageFromError
       ? STATUS_MESSAGES[statusCode] ?? 'Something went wrong'
       : messageFromError;
    return {
      status: 'error',
      code: statusCode,
      message,
    };
  }

  return {
    status: 'ok',
    code: statusCode,
    data,
  };
}

export function getResponse(
  c: Context,
  statusCode: StatusCode,
  headers: Record<string, string | string[]>,
  body: unknown
) {
  return c.newResponse(JSON.stringify(body), statusCode, headers);
}

export const corsConfig = {
  origin: [env.FRONTEND_URL, env.PREVIEW_URL],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  credentials: true,
  maxAge: 86400,
};
