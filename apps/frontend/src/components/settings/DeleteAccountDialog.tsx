'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { deleteAccountSchema } from '@/schemas/auth';
import { useState } from 'react';
import { auth } from '@/auth/client';
import { useRouter } from 'next/navigation';
import { Banner } from '../ui/banner';
import { Checkbox } from '../ui/checkbox';

export function DeleteAccountDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      password: '',
      confirmationText: '',
      understandRisks: false,
    },
    onSubmit: ({ value }) => {
      if (
        !value.understandRisks ||
        value.confirmationText.trim().toLowerCase() !== 'delete my account'
      ) {
        setErrorMessage('Please complete all confirmation steps.');
        return;
      }

      setErrorMessage('');
      setIsAuthenticating(true);

      auth.deleteUser(
        {
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push('/sign-up');
          },
          onError: (ctx) => {
            setIsAuthenticating(false);
            if (ctx.error.code === 'INVALID_PASSWORD') {
              setErrorMessage('Invalid password.');
            } else {
              setErrorMessage('Sorry, something went wrong.');
            }
          },
        }
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-background p-4 pb-0 max-w-full h-[100dvh] md:h-fit md:max-w-[30rem] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="ml-2 mb-2 md:font-semibold text-foreground mt-auto md:mt-0 text-xl font-bold">
            Delete account
          </DialogTitle>
          <DialogDescription className="sr-only">
            This action is permanent and cannot be undone. All your data will be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-1 px-2 pt-2 pb-1"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="confirmationText"
            children={(field) => (
              <div className="flex flex-col mb-4 gap-1">
                <Label htmlFor="delete-confirm">
                  Type "Delete my account" to confirm
                </Label>
                <Input
                  id="delete-confirm"
                  type="text"
                  value={field.state.value}
                  success={
                    field.state.value.trim().toLowerCase() ===
                    'delete my account'
                  }
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Delete my account"
                  disableAutoComplete={true}
                />
              </div>
            )}
          />

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
                  disableAutoComplete={true}
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
                  type={showPassword ? 'text' : 'password'}
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
            name="understandRisks"
            children={(field) => (
              <div className="flex items-start gap-3 mb-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <Checkbox
                  variant="destructive"
                  id="understand-checkbox"
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                <Label
                  htmlFor="understand-checkbox"
                  className="text-sm text-foreground cursor-pointer"
                >
                  I understand that this action is permanent and will
                  permanently delete my account and all associated data. This
                  cannot be undone.
                </Label>
              </div>
            )}
          />
          <div className="w-full ml-auto mb-4 mt-4 flex items-end justify-end gap-4">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
                isValid: state.isValid,
                fieldMeta: state.fieldMeta,
                values: state.values,
              })}
              children={({ isSubmitting, isValid, fieldMeta, values }) => {
                const allFieldsValid = Object.entries(fieldMeta).every(
                  ([_, meta]) =>
                    meta.isDirty && !meta.errors.length && !meta.isValidating
                );
                const deleteConfirmed =
                  values.confirmationText?.trim().toLowerCase() ===
                  'delete my account';
                const risksUnderstood = values.understandRisks === true;

                const allConditionsMet =
                  risksUnderstood &&
                  deleteConfirmed &&
                  allFieldsValid &&
                  isValid;

                return (
                  <Button
                    type="submit"
                    size="sm"
                    variant="destructive"
                    onClick={form.handleSubmit}
                    disabled={!allConditionsMet}
                    aria-disabled={!allConditionsMet}
                    loading={isSubmitting || isAuthenticating}
                  >
                    Delete Account Permanently
                  </Button>
                );
              }}
            />
          </div>
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
