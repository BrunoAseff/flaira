"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { deleteAccountSchema } from "@/schemas/auth";
import { useState } from "react";
import { auth } from "@/auth/client";
import { useRouter } from "next/navigation";
import { Banner } from "../ui/banner";

export function DeleteAccountDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      password: "",
    },
    onSubmit: ({ value }) => {
      setErrorMessage("");
      setIsAuthenticating(true);

      auth.deleteUser(
        {
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/sign-up");
          },
          onError: (ctx) => {
            setIsAuthenticating(false);
            if (ctx.error.code === "INVALID_PASSWORD") {
              setErrorMessage("Invalid password.");
            } else {
              setErrorMessage("Sorry, something went wrong.");
            }
          },
        },
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-background p-4 max-w-[30rem] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="ml-5 mb-1 text-foreground text-2xl font-semibold">
            Delete account
          </DialogTitle>
          <DialogDescription className="ml-5 mb-6 text-foreground/40 text-base font-semibold">
            This action is permanent and cannot be undone. All your data will be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4 px-5 pt-2 pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col mb-2 gap-1">
            <Label htmlFor="delete-confirm">Type “Delete my account”</Label>
            <Input
              id="delete-confirm"
              type="text"
              value={deleteText}
              success={deleteText.trim().toLowerCase() === "delete my account"}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Delete my account"
              autoComplete="off"
            />
          </div>

          <form.Field
            name="password"
            validators={{
              onChangeAsync: deleteAccountSchema.shape.password,
              onChangeAsyncDebounceMs: 500,
            }}
            children={(field) => (
              <div className="flex flex-col mb-3 gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  iconLeft={<KeyRound />}
                  iconRight={
                    showPassword ? (
                      <Eye
                        role="button"
                        tabIndex={0}
                        aria-label="Hide password"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeOff
                        role="button"
                        tabIndex={0}
                        aria-label="Show password"
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
              const allFieldsValid = Object.entries(fieldMeta).every(
                ([_, meta]) =>
                  meta.isDirty && !meta.errors.length && !meta.isValidating,
              );
              const deleteConfirmed =
                deleteText.trim().toLowerCase() === "delete my account";

              return (
                <Button
                  type="submit"
                  variant="destructive"
                  onClick={form.handleSubmit}
                  disabled={!deleteConfirmed || !allFieldsValid || !isValid}
                  aria-disabled={
                    !deleteConfirmed || !allFieldsValid || !isValid
                  }
                  loading={isSubmitting || isAuthenticating}
                >
                  Delete Account
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

        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
