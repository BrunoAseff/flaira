'use client';

import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import Link from 'next/link';
import { auth } from '@/auth/client';
import { useRouter } from 'next/navigation';
import Logo from '../brand/Logo';
import SignInForm from '../forms/SignInForm';

export default function SignIn() {
  const { data: session } = auth.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none">
      <CardHeader>
        <Logo size="md" />
        <CardTitle className="text-left mr-auto font-semibold text-foreground text-xl mt-1 md:mt-3">
          Sign in
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className="flex flex-col w-full gap-4 place-items-center">
        <Link
          className="text-base w-fit text-link hover:underline transition-all duration-300 font-medium"
          href={'/sign-up'}
        >
          Don't have an account? Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
}
