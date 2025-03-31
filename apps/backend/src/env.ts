import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  PORT: z.coerce.number().default(3001),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables.", _env.error.format());

  throw new Error(
    "Invalid environment variables. Please ensure DATABASE_URL is properly set in your .env file.",
  );
}

export const env = _env.data;
export type Env = z.infer<typeof envSchema>;
