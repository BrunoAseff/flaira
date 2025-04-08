import { db } from "@/db";
import { sql } from "drizzle-orm";

export const getDatabaseStatus = async () => {
  const [version, maxConnections, openConnections] = await Promise.all([
    db.execute(sql`SELECT version();`),
    db.execute(sql`SHOW max_connections;`),
    db.execute(sql`SELECT count(*) FROM pg_stat_activity;`),
  ]);

  return {
    postgres_version: version.rows[0]?.version || "unknown",
    max_connections: maxConnections.rows[0]?.max_connections || "unknown",
    open_connections: openConnections.rows[0]?.count || "unknown",
  };
};
