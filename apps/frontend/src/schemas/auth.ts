import { z } from "zod";

const email = z.string().email("Invalid email").trim().toLowerCase();
const username = z
  .string()
  .min(3, "Username is too short")
  .max(30, "Username is too long")
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid username")
  .trim();

const signUpPassword = z
  .string()
  .min(8, "Password is too short")
  .max(100, "Password is too long");

const signInPassword = z
  .string()
  .min(8, "Invalid password")
  .max(100, "Invalid password");

export const signUpSchema = z.object({
  username,
  email,
  password: signUpPassword,
  confirmPassword: signUpPassword,
});

export const signInSchema = z.object({
  email,
  password: signInPassword,
});
