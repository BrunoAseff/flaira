import { Hono } from "hono";
import { status } from "@/modules/status/route";
import { auth } from "./utils/auth";

const app = new Hono();

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.route("/status", status);

export { app };
