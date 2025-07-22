'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import Link from 'next/link';
import Logo from '../brand/Logo';
import SignUpForm from '../forms/SignUpForm';

export default function SignUp() {
  return (
    <Card className="w-[90%] max-h-[95%] overflow-auto md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none">
      <CardHeader>
        <Logo size="md" />
        <CardTitle className="text-left mr-auto font-semibold text-foreground text-xl mt-1 md:mt-3">
          Create an account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className="flex flex-col w-full gap-4 place-items-center">
        <Link
          className="text-base w-fit text-link hover:underline transition-all duration-300 font-medium"
          href="/sign-in"
        >
          Already have an account? Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
