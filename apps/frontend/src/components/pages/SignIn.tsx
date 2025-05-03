"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
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
import { signInSchema } from "@/schemas/auth";

type User = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as User,
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <Card className="w-[90%] md:w-[32rem] bg-background p-6 rounded-2xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-left mr-auto font-semibold text-foreground text-2xl mb-1 md:mb-6">
          Sign in to Flaira
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
              onChangeAsync: signInSchema.shape.email,
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
                        className="text-accent cursor-pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeOff
                        className="text-accent cursor-pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
                <Link
                  className="text-base mt-1 w-fit text-link hover:underline transition-all duration-300 font-medium"
                  href={"/forgot-password"}
                >
                  Forgot my password
                </Link>
              </div>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col w-full gap-4 place-items-center">
        <Button type="submit" onClick={form.handleSubmit}>
          Sign in
        </Button>
        <Link
          className="text-base w-fit text-link hover:underline transition-all duration-300 font-medium"
          href={"/sign-up"}
        >
          Don't have an account? Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
}
