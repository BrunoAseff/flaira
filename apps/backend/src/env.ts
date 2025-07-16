import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.coerce.number().default(3001),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  FRONTEND_URL: z.string(),
  PREVIEW_URL: z.string(),
  RESEND_API: z.string(),
  S3_BUCKET: z.string(),
  AWS_REGION: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment variables.', _env.error.format());

  throw new Error(
    `Invalid environment variables: ${JSON.stringify(_env.error.format())}`
  );
}

export const env = _env.data;
export type Env = z.infer<typeof envSchema>;
