import { z } from "zod";

const passwordSchema = z.string().min(8).max(100);

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .trim(),
  email: z.string().email(),
  password: passwordSchema,
  confirmPassword: passwordSchema,
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});
