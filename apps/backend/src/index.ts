import { serve } from '@hono/node-server';
import { app } from '@/app';
import { env } from '@/env';
import { logger } from '@/utils/logger';

serve({
  fetch: app.fetch,
  port: env.PORT,
});

logger.info({ port: env.PORT }, 'Server running');
