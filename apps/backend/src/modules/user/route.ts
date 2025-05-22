import { Hono } from "hono";
import { deleteAvatar, getAvatar, uploadAvatar } from "./controller";

const user = new Hono();

user.post("/upload-avatar", uploadAvatar);
user.get("/get-avatar", getAvatar);
user.delete("/delete-avatar", deleteAvatar);

export { user };
