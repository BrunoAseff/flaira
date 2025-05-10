import { z } from "zod";

const email = z.string().email("Invalid email").trim().toLowerCase();
const name = z
  .string()
  .min(3, "Name is too short")
  .max(100, "Name is too long")
  .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/, "Invalid name");

const signUpPassword = z
  .string()
  .min(8, "Password is too short")
  .max(100, "Password is too long");

const signInPassword = z
  .string()
  .min(8, "Invalid password")
  .max(100, "Invalid password");

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

export const resetPasswordSchema = z.object({
  password: signUpPassword,
  confirmPassword: signUpPassword,
});
