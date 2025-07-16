import { z } from 'zod';

const email = z.string().email('Invalid email address').trim().toLowerCase();
export const name = z
  .string()
  .min(3, 'Name must be at least 3 characters')
  .max(100, 'Name cannot exceed 100 characters')
  .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/, 'Name can only contain letters');

const signUpPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password cannot exceed 100 characters');

const signInPassword = z
  .string()
  .min(8, 'Incorrect password format')
  .max(100, 'Incorrect password format');

export const signUpSchema = z.object({
  name,
  email,
  password: signUpPassword,
  confirmPassword: signUpPassword,
});

export const signInSchema = z.object({
  email,
  password: signInPassword,
});

export const forgotPasswordSchema = z.object({
  email,
});

export const deleteAccountSchema = z.object({
  password: signInPassword,
});

export const resetPasswordSchema = z.object({
  password: signUpPassword,
  confirmPassword: signUpPassword,
});
