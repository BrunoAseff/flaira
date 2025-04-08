import type { Context } from "hono";
import { getDatabaseStatus } from "./service";
import { env } from "@/env";

export const getStatus = async (c: Context) => {
  try {
    const dbStatus = await getDatabaseStatus();

    return c.json({
      status: "ok",
      code: 200,
      ...dbStatus,
    });
  } catch (error) {
    console.error("Database status check failed:", error);
    let errorMessage = "Database unavailable";

    if (error instanceof Error) {
      errorMessage =
        env.NODE_ENV === "production"
          ? "Database unavailable"
          : `Database error: ${error.message}`;
    }

    return c.json({ status: "error", message: errorMessage }, 500);
  }
};
