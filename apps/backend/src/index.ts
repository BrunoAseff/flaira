import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hono API is running" });
});

serve({
  fetch: app.fetch,
  port: 3001,
});
