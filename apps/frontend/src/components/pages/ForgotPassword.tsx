'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import type { z } from 'zod';
import { useState } from 'react';
import { forgotPasswordSchema } from '@/schemas/auth';
import { auth } from '@/auth/client';
import { Banner } from '../ui/banner';

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
    } as ForgotPasswordData,
    onSubmit: async ({ value }) => {
      setErrorMessage('');
      setIsFetching(true);

      await auth.forgetPassword(
        {
          email: value.email,
        },
        {
          onSuccess: () => {
            setIsSuccess(true);
            setIsFetching(false);
          },
          onError: () => {
            setIsFetching(false);
            setErrorMessage('Sorry, something went wrong.');
          },
        }
      );
    },
  });

  if (isSuccess) {
    return (
      <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none text-center">
        <CardHeader>
          <CardTitle className="text-foreground text-2xl font-semibold">
            Check your email
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-1">
          <Mail className="w-16 h-16 text-success" />
          <p className="text-base text-foreground">
            We've sent a password reset link to your email address. Please check
            your inbox and follow the instructions to reset your password.
          </p>
          <p className="text-sm text-muted-foreground">
            If you don't see the email, please check your spam folder.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-left mr-auto font-semibold text-foreground text-xl mt-1 md:mt-3">
          Reset password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            validators={{
              onChangeAsync: forgotPasswordSchema.shape.email,
              onChangeAsyncDebounceMs: 500,
            }}
            name="email"
            children={(field) => (
              <div className="flex flex-col mb-3 gap-1">
                <div className="flex w-full justify-between">
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input
                  iconLeft={<Mail />}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  success={
                    field.state.meta.isDirty &&
                    field.state.meta.isTouched &&
                    !field.state.meta.errors.length &&
                    field.state.meta.isValid &&
                    !field.state.meta.isValidating
                  }
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                  onBlur={() => {
                    field.handleBlur();
                  }}
                />
                <em className="ml-auto h-1">
                  {field.state.meta.errors[0] &&
                    (field.state.meta.isDirty || form.state.isSubmitting) && (
                      <p className="text-error text-sm md:text-base font-medium">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                </em>
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => ({
              isSubmitting: state.isSubmitting,
              isValid: state.isValid,
              fieldMeta: state.fieldMeta,
            })}
            children={({ isSubmitting, isValid, fieldMeta }) => {
              const allFieldsFilled = Object.entries(fieldMeta).every(
                ([_, meta]) =>
                  meta.isDirty && !meta.errors.length && !meta.isValidating
              );

              return (
                <Button
                  className="mt-3 mb-1"
                  type="submit"
                  onClick={form.handleSubmit}
                  disabled={!allFieldsFilled || !isValid}
                  aria-disabled={!allFieldsFilled || !isValid}
                  loading={isSubmitting || isFetching}
                >
                  Send Reset Link
                </Button>
              );
            }}
          />
          {errorMessage && (
            <Banner role="alert" aria-live="assertive" variant="error">
              {errorMessage}
            </Banner>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col w-full gap-4 place-items-center">
        <Link
          className="text-base w-fit text-link hover:underline transition-all duration-300 font-medium"
          href={'/sign-in'}
        >
          Return to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
