"use client";

import { useEffect, useState } from "react";
import { MailSearch } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { auth } from "@/auth/client";

export default function VerifyEmail() {
  const [timer, setTimer] = useState(60);
  const [isCooldown, setIsCooldown] = useState(true);
  const { data: session } = auth.useSession();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsCooldown(false);
    }
  }, [timer]);

  function handleResend() {
    setIsCooldown(true);
    setTimer(60);
    if (session?.user.email) {
      auth.sendVerificationEmail({
        email: session?.user.email,
      });
    }
  }

  return (
    <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none text-center">
      <CardHeader>
        <CardTitle className="text-foreground text-2xl font-semibold">
          Check your email
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <MailSearch className="w-16 h-16 text-success" />
        <p className="text-base text-foreground">
          Thanks for creating an account! We’ve sent you a verification link.
          Please check your inbox.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <p className="text-base text-muted-foreground">
          Didn’t receive the email? Click the button below:
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
