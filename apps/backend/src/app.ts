import { Hono } from "hono";
import { status } from "@/modules/status/route";

const app = new Hono();

app.route("/status", status);

export { app };
