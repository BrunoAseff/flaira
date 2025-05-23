import { getHeaders, getBody, getResponse } from "@/utils/http";
import { checkUser } from "@/utils/checkUser";
import type { Context } from "hono";

export const middleware = async (c: Context, next: () => Promise<void>) => {
  const user = checkUser({ context: c });
  if (!user) {
    const headers = getHeaders();
    const body = getBody(401, null);
    return getResponse(c, 401, headers, body);
  }
  c.set("user", user);
  await next();
};
