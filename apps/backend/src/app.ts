import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './utils/auth';
import { corsConfig } from './utils/http';
import { user } from '@/modules/user/route';
import { directions } from '@/modules/directions/route';
import { status } from '@/modules/status/route';
import { trip } from '@/modules/trip/route';

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use('*', cors(corsConfig));

app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  c.set('user', session.user);
  c.set('session', session.session);
  return next();
});

app.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

app.route('/status', status);

app.route('/user', user);

app.route('/directions', directions);

app.route('/trip', trip);

export { app };
