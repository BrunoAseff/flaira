import { db } from "@/db";
import { env } from "@/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import * as schema from "../db/schema/auth";

const resend = new Resend(env.RESEND_API);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: [env.FRONTEND_URL],
  basePath: "/auth",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      await resend.emails.send({
        from: "Flaira <welcome@flaira.net>",
        to: [user.email],
        subject: "Reset your password",
        text: `Click the link to reset your password:  ${env.FRONTEND_URL}/forgot-password/${token}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      await resend.emails.send({
        from: "Flaira <welcome@flaira.net>",
        to: [user.email],
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${env.FRONTEND_URL}/verify-email/${token}`,
      });
    },
  },
});
