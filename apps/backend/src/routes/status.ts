import { Hono } from "hono";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const status = new Hono();

status.get("/", async (c) => {
  try {
    const version = await db.execute(sql`SELECT version();`);
    const maxConnections = await db.execute(sql`SHOW max_connections;`);

    return c.json({
      status: "ok",
      code: 200,
      postgres_version: version.rows[0]?.version || "unknown",
      max_connections: maxConnections.rows[0]?.max_connections || "unknown",
    });
  } catch (error) {
    console.error("Database status check failed:", error);
    return c.json({ status: "error", message: "Database unavailable" }, 500);
  }
});
