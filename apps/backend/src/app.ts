import { Hono } from "hono";
import { cors } from "hono/cors";
import { status } from "@/modules/status/route";
import { auth } from "./utils/auth";
import { corsConfig } from "./utils/http";
import { user } from "./modules/user/route";

const app = new Hono();

app.use("*", cors(corsConfig));

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

app.route("/status", status);

app.route("/user", user);

export { app };
