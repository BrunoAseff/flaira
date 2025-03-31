import { Hono } from "hono";
import { status } from "@/routes/status";

const app = new Hono();

app.route("/status", status);

export { app };
