import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { addTrip, uploadMemory, getMemory, deleteMemory } from './controller';
import { createTripSchema } from './validator';
import { middleware } from '@/utils/middleware';

const trip = new Hono();

trip.use(middleware);

trip.post(
  '/create',
  zValidator('json', createTripSchema, (result, c) => {
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return c.json(
        {
          status: 'error',
          code: 422,
          message: 'Validation failed',
          errors,
        },
        422
      );
    }
  }),
  addTrip
);

trip.post('/upload-memory', uploadMemory);
trip.get('/get-memory', getMemory);
trip.delete('/delete-memory', deleteMemory);

export { trip };
