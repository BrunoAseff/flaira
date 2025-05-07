"use client";

import { ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { auth } from "@/auth/client";
import { useCooldown } from "@/hooks/useCooldown";

export default function NotVerified() {
  const { timer, isCooldown, startCooldown } = useCooldown();
  const { data: session } = auth.useSession();

  function handleResend() {
    const email = session?.user.email;

    startCooldown();

    if (email) {
      auth.sendVerificationEmail({
        email,
      });
    }
  }

  return (
    <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none text-center">
      <CardHeader>
        <CardTitle className="text-foreground text-2xl font-semibold">
          Email Verification Required
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <ShieldAlert className="w-16 h-16 text-error" />
        <p className="text-base text-foreground">
          Your email hasn't been verified yet. Please verify your email address
          by clicking the link we sent to your inbox.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <p className="text-base text-muted-foreground">
          Haven't received the verification email? Click the button below:
        </p>
        <Button
          onClick={handleResend}
          disabled={isCooldown}
          aria-disabled={isCooldown}
        >
          {isCooldown ? `Wait ${timer}s` : "Resend verification email"}
        </Button>
      </CardFooter>
    </Card>
  );
}
