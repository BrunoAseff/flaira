import { createAuthClient } from "better-auth/react";
import { env } from "../../env";

export const auth = createAuthClient({
  baseURL: `${env.API_URL}/auth`,
});
