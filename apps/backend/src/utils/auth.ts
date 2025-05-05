import { db } from "@/db";
import { env } from "@/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  basePath: "/auth",
  emailAndPassword: {
    enabled: true,
  },
  requireEmailVerifications: true,
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Flaira <welcome@flaira.net>",
        to: [user.email],
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
});
