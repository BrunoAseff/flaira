"use client";

import { useEffect } from "react";
import { auth } from "@/auth/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCooldown } from "@/hooks/use-cooldown";

export default function EmailConfirmed({
  isVerified,
}: {
  isVerified: boolean;
}) {
  const router = useRouter();
  const { timer, isCooldown, startCooldown } = useCooldown();
  const { data: session } = auth.useSession();

  useEffect(() => {
    if (isVerified) {
      router.push("/");
    }
  }, [isVerified, router]);

  const handleResend = () => {
    startCooldown();

    if (session?.user?.email) {
      auth.sendVerificationEmail({
        email: session.user.email,
      });
    }
  };

  if (isVerified) {
    return null;
  }

  return (
    <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none text-center">
      <CardHeader>
        <CardTitle className="text-foreground text-2xl font-semibold">
          Verification failed
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-1">
        <XCircle className="w-16 h-16 text-destructive" />
        <p className="text-base text-foreground">
          We couldn't verify your email. The verification link may have expired
          or is invalid.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <p className="text-base text-muted-foreground">
          Need a new verification link? Click the button below:
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
