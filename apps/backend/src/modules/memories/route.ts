import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  uploadMemory,
  getMemory,
  deleteMemory,
  getRandomMemories,
} from './controller';

import { middleware } from '@/utils/middleware';
import {
  deleteMemorySchema,
  getMemorySchema,
  uploadMemorySchema,
} from './validator';

const memory = new Hono();

memory.use(middleware);

memory.post(
  '/upload-memory',
  zValidator('json', uploadMemorySchema, (result, c) => {
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
  uploadMemory
);

memory.get(
  '/get-memory',
  zValidator('query', getMemorySchema, (result, c) => {
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
  getMemory
);

memory.get('/get-random-memories', getRandomMemories);

memory.delete(
  '/delete-memory',
  zValidator('query', deleteMemorySchema, (result, c) => {
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
  deleteMemory
);
