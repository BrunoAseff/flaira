import { Hono } from 'hono';
import { deleteAvatar, getAvatar, uploadAvatar } from './controller';
import { zValidator } from '@hono/zod-validator';
import { getAvatarSchema, uploadAvatarSchema } from './validator';
import { middleware } from '@/utils/middleware';

const user = new Hono();

user.use(middleware);

user.post(
  '/upload-avatar',
  zValidator('json', uploadAvatarSchema, (result, c) => {
    if (!result.success) return c.text('Invalid format', 422);
  }),
  uploadAvatar
);
user.get(
  '/get-avatar',
  zValidator('query', getAvatarSchema, (result, c) => {
    if (!result.success) return c.text('Invalid key', 422);
  }),
  getAvatar
);
user.delete(
  '/delete-avatar',
  zValidator('query', getAvatarSchema, (result, c) => {
    if (!result.success) return c.text('Invalid key', 422);
  }),
  deleteAvatar
);

export { user };
