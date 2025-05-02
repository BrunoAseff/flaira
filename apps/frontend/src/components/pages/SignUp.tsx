"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, Mail, User as UserIcon } from "lucide-react";
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
import { signUpSchema } from "@/schemas/auth";

type User = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasInteracted, setHasInteracted] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as User,
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-left mr-auto font-semibold text-foreground text-2xl mb-1 md:mb-6">
          Sign up to Flaira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <form.Field
            validators={{
              onChangeAsync: signUpSchema.shape.username,
              onChangeAsyncDebounceMs: 500,
            }}
            name="username"
            children={(field) => (
              <div className="flex flex-col mb-3 gap-1">
                <div className="flex w-full justify-between">
                  <Label htmlFor="username">Username</Label>
                  <div className="h-6">
                    {field.state.meta.errors[0] && (
                      <p className="text-error text-base font-medium">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </div>
                </div>
                <Input
                  iconLeft={<UserIcon />}
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  success={
                    hasInteracted.username &&
                    field.state.meta.isTouched &&
                    !field.state.meta.errors.length &&
                    field.state.meta.isValid &&
                    !field.state.meta.isValidating &&
                    field.state.value.length > 0
                  }
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (!hasInteracted.username && e.target.value.length > 0) {
                      setHasInteracted((prev) => ({ ...prev, username: true }));
                    }
                  }}
                  onBlur={() => {
                    field.handleBlur();
                    if (field.state.value.length > 0) {
                      setHasInteracted((prev) => ({ ...prev, username: true }));
                    }
                  }}
                />
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
                  <div className="h-6">
                    {field.state.meta.errors[0] && (
                      <p className="text-error text-base font-medium">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </div>
                </div>
                <Input
                  iconLeft={<Mail />}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  success={
                    hasInteracted.email &&
                    field.state.meta.isTouched &&
                    !field.state.meta.errors.length &&
                    field.state.meta.isValid &&
                    !field.state.meta.isValidating
                  }
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (!hasInteracted.email && e.target.value.length > 0) {
                      setHasInteracted((prev) => ({ ...prev, email: true }));
                    }
                  }}
                  onBlur={() => {
                    field.handleBlur();
                    if (field.state.value.length > 0) {
                      setHasInteracted((prev) => ({ ...prev, email: true }));
                    }
                  }}
                />
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
                  <div className="h-6">
                    {field.state.meta.errors[0] && (
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
                    hasInteracted.password &&
                    field.state.meta.isTouched &&
                    !field.state.meta.errors.length &&
                    field.state.meta.isValid &&
                    !field.state.meta.isValidating
                  }
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (!hasInteracted.password && e.target.value.length > 0) {
                      setHasInteracted((prev) => ({ ...prev, password: true }));
                    }
                  }}
                  onBlur={() => {
                    field.handleBlur();
                    if (field.state.value.length > 0) {
                      setHasInteracted((prev) => ({ ...prev, password: true }));
                    }
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
                  <Label htmlFor="confirmPassword">Confirm your password</Label>
                  <div className="h-6">
                    {field.state.meta.errors[0] &&
                      hasInteracted.confirmPassword && (
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
                    hasInteracted.confirmPassword &&
                    field.state.meta.isTouched &&
                    !field.state.meta.errors.length &&
                    field.state.meta.isValid &&
                    !field.state.meta.isValidating
                  }
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (
                      !hasInteracted.confirmPassword &&
                      e.target.value.length > 0
                    ) {
                      setHasInteracted((prev) => ({
                        ...prev,
                        confirmPassword: true,
                      }));
                    }
                  }}
                  onBlur={() => {
                    field.handleBlur();
                    if (field.state.value.length > 0) {
                      setHasInteracted((prev) => ({
                        ...prev,
                        confirmPassword: true,
                      }));
                    }
                  }}
                />
              </div>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col w-full gap-4 place-items-center">
        <Button type="submit" onClick={form.handleSubmit}>
          Sign up
        </Button>
        <Link
          className="text-base w-fit text-link hover:underline transition-all duration-300 font-medium"
          href={"/sign-in"}
        >
          Already have an account? Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
