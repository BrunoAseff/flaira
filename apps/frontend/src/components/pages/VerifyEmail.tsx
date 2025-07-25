'use client';

import { MailSearch } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { auth } from '@/auth/client';
import { useCooldown } from '@/hooks/use-cooldown';

export default function VerifyEmail() {
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
          Check your email
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-1">
        <MailSearch className="w-16 h-16 text-success" />
        <p className="text-base text-foreground">
          Thanks for creating an account! We've sent you a verification link.
          Please check your inbox.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <p className="text-base text-foreground/60">
          Didn't receive the email? Click the button below:
        </p>
        <Button
          onClick={handleResend}
          disabled={isCooldown}
          aria-disabled={isCooldown}
        >
          {isCooldown ? `Wait ${timer}s` : 'Resend verification email'}
        </Button>
      </CardFooter>
    </Card>
  );
}
