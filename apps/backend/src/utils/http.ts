import { env } from "@/env";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

export function getHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };
}

export function getBody(statusCode: number, data?: unknown, error?: unknown) {
  if (error) {
    const message =
      error instanceof Error && env.NODE_ENV !== "production"
        ? error.message
        : "Something went wrong";

    return {
      status: "error",
      code: statusCode,
      message,
    };
  }

  return {
    status: "ok",
    code: statusCode,
    data,
  };
}

export function getResponse(
  c: Context,
  statusCode: StatusCode,
  headers: Record<string, string | string[]>,
  body: unknown,
) {
  return c.newResponse(JSON.stringify(body), statusCode, headers);
}

export const corsConfig = {
  origin: [env.FRONTEND_URL, env.PREVIEW_URL],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length"],
  credentials: true,
  maxAge: 86400,
};
