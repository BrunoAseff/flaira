import { Hono } from "hono";
import { deleteAvatar, getAvatar, uploadAvatar } from "./controller";
import { zValidator } from "@hono/zod-validator";
import { uploadAvatarSchema } from "./validator";

const user = new Hono();

user.post(
  "/upload-avatar",
  zValidator("json", uploadAvatarSchema, (result, c) => {
    if (!result.success) return c.text("Invalid format", 422);
  }),
  uploadAvatar,
);
user.get("/get-avatar", getAvatar);
user.delete("/delete-avatar", deleteAvatar);

export { user };
