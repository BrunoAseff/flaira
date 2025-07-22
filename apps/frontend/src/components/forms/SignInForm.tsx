'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Link from 'next/link';
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { signInSchema } from '@/schemas/auth';
import { auth } from '@/auth/client';
import { useRouter } from 'next/navigation';
import { Banner } from '../ui/banner';
import type { z } from 'zod';

type User = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as User,
    onSubmit: ({ value }) => {
      setErrorMessage('');
      setIsAuthenticating(true);
      auth.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onError: (ctx) => {
            setIsAuthenticating(false);
            if (ctx.error.code === 'EMAIL_NOT_VERIFIED') {
              localStorage.setItem('current-email', value.email);
              router.push('/verify-email/not-verified');
            } else if (ctx.error.code === 'INVALID_EMAIL_OR_PASSWORD') {
              setErrorMessage('Incorrect username or password.');
            } else {
              setErrorMessage('Sorry, something went wrong.');
            }
          },
          onSuccess: () => {
            router.push('/');
          },
        }
      );
    },
  });

  return (
    <form
      className="flex flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        validators={{
          onChangeAsync: signInSchema.shape.email,
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
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={() => field.handleBlur()}
            />
            <em className="ml-auto h-1">
              {field.state.meta.errors[0] && (
                <p className="text-error text-sm md:text-base font-medium">
                  {field.state.meta.errors[0].message}
                </p>
              )}
            </em>
          </div>
        )}
      />
      <form.Field
        name="password"
        validators={{
          onChangeAsync: signInSchema.shape.password,
          onChangeAsyncDebounceMs: 500,
        }}
        children={(field) => (
          <div className="flex flex-col mb-3 gap-1">
            <div className="flex w-full justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-base mt-1 w-fit text-link hover:underline transition-all duration-300 font-medium"
                href={'/forgot-password'}
              >
                Forgot my password
              </Link>
            </div>
            <Input
              iconLeft={<KeyRound />}
              iconRight={
                showPassword ? (
                  <Eye
                    aria-label="Hide password"
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <EyeOff
                    aria-label="Show password"
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              success={
                field.state.meta.isDirty &&
                field.state.meta.isTouched &&
                !field.state.meta.errors.length &&
                field.state.meta.isValid &&
                !field.state.meta.isValidating
              }
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={() => field.handleBlur()}
            />
            <em className="ml-auto h-1">
              {field.state.meta.errors[0] && (
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
              className="mt-3 mb-2"
              type="submit"
              disabled={!allFieldsFilled || !isValid}
              aria-disabled={!allFieldsFilled || !isValid}
              loading={isSubmitting || isAuthenticating}
            >
              Sign In
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
  );
}
