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
import { FormFooter } from '../forms/FormFooter';
import { FormHeader } from '../forms/FormHeader';

export default function SignUp() {
  return (
    <Card className="w-[90%] max-h-[95%] overflow-auto md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none">
      <FormHeader title="Create an account" hasLogo />
      <CardContent>
        <SignUpForm />
      </CardContent>
      <FormFooter cta="Already have an account? Sign In" href="/sign-in" />
    </Card>
  );
}
