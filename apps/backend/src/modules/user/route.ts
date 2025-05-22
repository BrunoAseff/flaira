import { Hono } from "hono";
import { uploadAvatar } from "./controller";

const user = new Hono();

user.post("/upload-avatar", uploadAvatar);

export { user };
