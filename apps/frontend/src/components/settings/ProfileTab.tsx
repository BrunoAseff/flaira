'use client';

import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import type { User } from 'better-auth/types';
import { name as nameSchema } from '../../schemas/auth';
import { Banner } from '../ui/banner';
import AvatarUpload from './avatar/AvatarUpload';
import { Input } from '../ui/input';
import { auth } from '@/auth/client';
import { useState, useEffect, useRef } from 'react';

interface ProfileTabProps {
  user: User | null;
  error: Error | null;
}

export default function ProfileTab({ user, error }: ProfileTabProps) {
  const [success, setSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  if (error) {
    return (
      <div className="w-full mt-12 flex flex-col h-full items-center justify-center">
        <Banner variant="error">
          We could not load your profile information.
        </Banner>
      </div>
    );
  }

  async function handleNameInputBlur({ name }: { name: string }) {
    setSuccess(false);
    setNameError(null);

    const validation = nameSchema.safeParse(name);

    if (!validation.success) {
      setNameError(validation.error.errors[0].message);
      return;
    }

    await auth.updateUser(
      {
        name,
      },
      {
        onSuccess: () => setSuccess(true),
      }
    );
  }

  function handleNameInputChange({ name }: { name: string }) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setSuccess(false);
    setNameError(null);

    debounceRef.current = setTimeout(() => {
      handleNameInputBlur({ name });
    }, 500);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col h-full">
      <ScrollArea className="flex-1 pb-16 max-h-[85vh] scrollbar-gutter-stable overflow-y-auto">
        <div className="w-full py-0 px-4 pb-10">
          <div className="w-full flex flex-col gap-6">
            <AvatarUpload user={user} />

            <Separator />

            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full justify-between items-center">
                <h1 className="text-base font-bold text-foreground/90">Name</h1>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  showClear={false}
                  defaultValue={user?.name || 'N/A'}
                  success={success}
                  onChange={(e) =>
                    handleNameInputChange({ name: e.target.value })
                  }
                  className=" text-foreground/80 p-2 max-w-64 ml-auto text-base"
                />
              </div>
              <em className="ml-auto h-1">
                {nameError && (
                  <p className="text-error text-sm md:text-base font-medium">
                    {nameError}
                  </p>
                )}
              </em>
            </div>

            <Separator />

            <div className="flex w-full justify-between items-center">
              <h1 className="text-base font-bold text-foreground/90">Email</h1>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                showClear={false}
                defaultValue={user?.email || 'N/A'}
                className=" text-foreground/80 p-2 max-w-64 ml-auto text-base"
                disabled
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
