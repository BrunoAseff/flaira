import { serve } from '@hono/node-server';
import { app } from '@/app';
import { env } from '@/env';

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`Server running on port ${env.PORT}`);
