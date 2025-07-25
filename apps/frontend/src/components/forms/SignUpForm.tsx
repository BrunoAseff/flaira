'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, KeyRound, Mail, User as UserIcon } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { signUpSchema } from '@/schemas/auth';
import { auth } from '@/auth/client';
import { useRouter } from 'next/navigation';
import { Banner } from '../ui/banner';

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      setErrorMessage('');
      setIsAuthenticating(true);
      await auth.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            router.push('/verify-email');
          },
          onError: (ctx) => {
            setIsAuthenticating(false);
            if (ctx.error.code === 'USER_ALREADY_EXISTS') {
              setErrorMessage('A user with this email already exists');
            } else {
              setErrorMessage('Sorry, something went wrong.');
            }
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
          onChangeAsync: signUpSchema.shape.name,
          onChangeAsyncDebounceMs: 500,
        }}
        name="name"
        children={(field) => (
          <div className="flex flex-col mb-3 gap-1">
            <div className="flex w-full justify-between">
              <Label htmlFor="name">Full name</Label>
            </div>
            <Input
              iconLeft={<UserIcon />}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              success={
                field.state.meta.isDirty &&
                field.state.meta.isTouched &&
                !field.state.meta.errors.length &&
                field.state.meta.isValid &&
                !field.state.meta.isValidating &&
                field.state.value.length > 0
              }
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={() => field.handleBlur()}
            />
            <em className="ml-auto h-1">
              {field.state.meta.errors[0] && (
                <p className="text-error text-sm font-medium">
                  {field.state.meta.errors[0].message}
                </p>
              )}
            </em>
          </div>
        )}
      />
      <form.Field
        validators={{
          onChangeAsync: signUpSchema.shape.email,
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
                <p className="text-error text-sm font-medium">
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
          onChangeAsync: signUpSchema.shape.password,
          onChangeAsyncDebounceMs: 500,
        }}
        children={(field) => (
          <div className="flex flex-col mb-3 gap-1">
            <div className="flex w-full justify-between items-center">
              <Label htmlFor="password">Password</Label>
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
              autoComplete="new-password"
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
                form.validateField('confirmPassword', 'change');
              }}
              onBlur={() => field.handleBlur()}
            />
            <em className="ml-auto h-1">
              {field.state.meta.errors[0] &&
                (field.state.meta.isDirty || form.state.isSubmitting) && (
                  <p className="text-error text-sm font-medium">
                    {field.state.meta.errors[0].message}
                  </p>
                )}
            </em>
          </div>
        )}
      />
      <form.Field
        name="confirmPassword"
        validators={{
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: ({ value, fieldApi }) => {
            if (value !== fieldApi.form.getFieldValue('password')) {
              return 'Passwords do not match';
            }
            return undefined;
          },
        }}
        children={(field) => (
          <div className="flex flex-col mb-3 gap-1">
            <div className="flex w-full justify-between items-center">
              <Label htmlFor="confirmPassword">Confirm your password</Label>
            </div>
            <Input
              iconLeft={<KeyRound />}
              iconRight={
                showConfirmPassword ? (
                  <Eye
                    aria-label="Hide password"
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <EyeOff
                    aria-label="Show password"
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )
              }
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
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
              {field.state.meta.errors[0] &&
                (field.state.meta.isDirty || form.state.isSubmitting) && (
                  <p className="text-error text-sm font-medium">
                    {field.state.meta.errors[0]}
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
              disabled={!allFieldsFilled || !isValid}
              aria-disabled={!allFieldsFilled || !isValid}
              loading={isSubmitting || isAuthenticating}
            >
              Sign Up
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
