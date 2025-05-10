"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, CheckCircle } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { z } from "zod";
import { useState } from "react";
import { resetPasswordSchema } from "@/schemas/auth";
import { auth } from "@/auth/client";
import { Banner } from "../ui/banner";
import { useRouter } from "next/navigation";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    } as ResetPasswordFormData,
    onSubmit: async ({ value }) => {
      setErrorMessage("");
      setIsResetting(true);
      await auth.resetPassword(
        {
          newPassword: value.password,
          token,
        },
        {
          onSuccess: () => {
            setSuccess(true);
          },
          onError: (ctx) => {
            setIsResetting(false);

            if (ctx.error.code === "INVALID_TOKEN") {
              setErrorMessage(
                "Invalid or expired reset token. Please request a new password reset link.",
              );
            } else {
              setErrorMessage("Sorry, something went wrong.");
            }
          },
        },
      );
    },
  });

  if (success) {
    return (
      <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none text-center">
        <CardHeader>
          <CardTitle className="text-foreground text-2xl font-semibold">
            Password Reset Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <CheckCircle className="w-16 h-16 text-success" />
          <p className="text-base text-foreground">
            Your password has been successfully updated. You can now sign in to
            your account using your new password.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-left mr-auto font-semibold text-foreground text-2xl mb-1 md:mb-6">
          Reset your password
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
            name="password"
            validators={{
              onChangeAsync: resetPasswordSchema.shape.password,
              onChangeAsyncDebounceMs: 500,
            }}
            children={(field) => (
              <div className="flex flex-col mb-3 gap-1">
                <div className="flex w-full justify-between items-center">
                  <Label htmlFor="password">New Password</Label>
                  <div className="h-6">
                    {field.state.meta.errors[0] &&
                      (field.state.meta.isDirty || form.state.isSubmitting) && (
                        <p className="text-error text-base font-medium">
                          {field.state.meta.errors[0].message}
                        </p>
                      )}
                  </div>
                </div>{" "}
                <Input
                  iconLeft={<KeyRound />}
                  iconRight={
                    showPassword ? (
                      <Eye
                        aria-label="Hide password"
                        role="button"
                        tabIndex={0}
                        className="text-accent cursor-pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeOff
                        aria-label="Show password"
                        role="button"
                        tabIndex={0}
                        className="text-accent cursor-pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
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
                    form.validateField("confirmPassword", "change");
                  }}
                  onBlur={() => {
                    field.handleBlur();
                  }}
                />
              </div>
            )}
          />

          <form.Field
            name="confirmPassword"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: ({ value, fieldApi }) => {
                if (value !== fieldApi.form.getFieldValue("password")) {
                  return "Passwords do not match";
                }
                return undefined;
              },
            }}
            children={(field) => (
              <div className="flex flex-col mb-3 gap-1">
                <div className="flex w-full justify-between items-center">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <div className="h-6">
                    {field.state.meta.errors[0] &&
                      (field.state.meta.isDirty || form.state.isSubmitting) && (
                        <p className="text-error text-base font-medium">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                  </div>
                </div>{" "}
                <Input
                  iconLeft={<KeyRound />}
                  iconRight={
                    showConfirmPassword ? (
                      <Eye
                        className="text-accent cursor-pointer"
                        onClick={() => setShowConfirmPassword(false)}
                      />
                    ) : (
                      <EyeOff
                        className="text-accent cursor-pointer"
                        onClick={() => setShowConfirmPassword(true)}
                      />
                    )
                  }
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
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
                  }}
                  onBlur={() => {
                    field.handleBlur();
                  }}
                />
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
                  meta.isDirty && !meta.errors.length && !meta.isValidating,
              );

              return (
                <Button
                  type="submit"
                  onClick={form.handleSubmit}
                  disabled={!allFieldsFilled || !isValid}
                  aria-disabled={!allFieldsFilled || !isValid}
                  loading={isSubmitting || isResetting}
                >
                  Reset Password
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
          href={"/sign-in"}
        >
          Return to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
