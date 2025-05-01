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
import { z } from "zod";
import { useState } from "react";

const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password should have at least 8 characters"),
});

type User = z.infer<typeof userSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [hasInteracted, setHasInteracted] = useState({
    email: false,
    password: false,
  });

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
        <CardTitle className="text-left mr-auto font-semibold text-foreground text-2xl mb-6">
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
              onChangeAsync: z.string().email("Invalid email format"),
              onChangeAsyncDebounceMs: 500,
            }}
            name="email"
            children={(field) => (
              <div className="flex flex-col mb-3 gap-1">
                <div className="flex w-full justify-between">
                  <Label htmlFor="email">Email</Label>
                  <div className="h-6">
                    {field.state.meta.errors[0] && (
                      <p className="text-error text-base">
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
                    !field.state.meta.isValidating &&
                    field.state.value.length > 0
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
              onChangeAsync: z.string().min(8, "Password is too short"),
              onChangeAsyncDebounceMs: 500,
            }}
            children={(field) => (
              <div className="flex flex-col mb-3 gap-1">
                <div className="flex w-full justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <div className="h-6">
                    {field.state.meta.errors[0] && (
                      <p className="text-error text-base">
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
                    hasInteracted.password &&
                    field.state.meta.isTouched &&
                    !field.state.meta.errors.length &&
                    field.state.meta.isValid &&
                    !field.state.meta.isValidating &&
                    field.state.value.length > 0
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
      <CardFooter>
        {" "}
        <Button onClick={form.handleSubmit}>Sign in</Button>
      </CardFooter>
    </Card>
  );
}
