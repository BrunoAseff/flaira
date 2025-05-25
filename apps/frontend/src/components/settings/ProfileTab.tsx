"use client";

import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import type { User } from "better-auth/types";

import { Banner } from "../ui/banner";
import AvatarUpload from "./AvatarUpload";

interface ProfileTabProps {
  user: User | null;
  error: Error | null;
}

export default function ProfileTab({ user, error }: ProfileTabProps) {
  if (error) {
    return (
      <div className="w-full mt-12 flex flex-col h-full items-center justify-center">
        <Banner variant="error">
          We could not load your profile information.
        </Banner>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <ScrollArea className="flex-1 pb-16 max-h-[85vh] scrollbar-gutter-stable overflow-y-auto">
        <div className="w-full py-0 px-4 pb-10">
          <div className="w-full flex flex-col gap-6">
            <AvatarUpload user={user} />

            <Separator />

            <div className="flex w-full justify-between items-center">
              <h1 className="text-base font-bold text-foreground/90">Name</h1>
              <span className="text-sm text-foreground/80">
                {user?.name || "N/A"}
              </span>
            </div>

            <Separator />

            <div className="flex w-full justify-between items-center">
              <h1 className="text-base font-bold text-foreground/90">Email</h1>
              <span className="text-sm text-foreground/80">
                {user?.email || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
