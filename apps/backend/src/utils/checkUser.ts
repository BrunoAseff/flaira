import type { Context } from "hono";

export const checkUser = ({ context }: { context: Context }) => {
  const session = context.get("session");
  const user = context.get("user");

  if (!session || !user) return false;

  return true;
};
