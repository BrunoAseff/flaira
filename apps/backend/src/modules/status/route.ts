import { Hono } from "hono";
import { getStatus } from "./controller";

const status = new Hono();

status.get("/", getStatus);

export { status };
