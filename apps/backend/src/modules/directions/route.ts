import { Hono } from 'hono';
import { getDirections } from './controller';
import { zValidator } from '@hono/zod-validator';
import { directionsRequestSchema } from './validator';

const directions = new Hono();

directions.post(
  '/',
  zValidator('json', directionsRequestSchema, (result, c) => {
    if (!result.success) return c.text('Invalid directions request', 422);
  }),
  getDirections
);

export { directions };
