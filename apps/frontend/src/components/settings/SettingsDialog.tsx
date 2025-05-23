"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/auth/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockKeyIcon, UserSquareIcon } from "@hugeicons/core-free-icons";
import SecurityTab from "./SecurityTab";
import { Separator } from "@/components/ui/separator";
import ProfileTab from "./ProfileTab";

export function SettingsDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { data: session, isPending, error } = auth.useSession();

  const {
    data: sessionsData,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await auth.listSessions();
      if (response.error) throw response.error;
      return response.data ?? [];
    },
    enabled: isOpen,
  });

  const sortedSessions = useMemo(() => {
    if (!sessionsData) return null;
    return sessionsData.slice().sort((a, b) => {
      if (a.id === session?.session.id) return -1;
      if (b.id === session?.session.id) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [sessionsData, session?.session.id]);

  const isLoading = isPending || isLoadingSessions;
  const fetchError = error || sessionsError;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-full sm:min-w-96 md:min-w-96 w-full md:w-[75%] lg:w-[50%] h-full md:h-[90%] bg-background p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-muted">
          <DialogTitle className="text-foreground text-xl font-semibold">
            Settings
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 w-full overflow-hidden px-6 pt-4">
          <Tabs
            className="flex w-full h-full"
            defaultValue="profile"
            orientation="vertical"
          >
            <TabsList className="flex flex-col mt-10 min-h-full bg-transparent gap-2 w-fit pr-4">
              <TabsTrigger value="profile">
                <HugeiconsIcon
                  icon={UserSquareIcon}
                  color="currentColor"
                  strokeWidth={2}
                  size={28}
                />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <HugeiconsIcon
                  icon={LockKeyIcon}
                  color="currentColor"
                  strokeWidth={2}
                  size={28}
                />
                Security
              </TabsTrigger>
            </TabsList>

            <Separator orientation="vertical" className="h-auto" />

            <TabsContent
              className="w-full flex-1 h-full overflow-hidden pl-4"
              value="profile"
            >
              <ProfileTab
                user={session?.user ?? null}
                error={error as Error | null}
              />
            </TabsContent>

            <TabsContent
              className="w-full flex-1 h-full overflow-hidden pl-4"
              value="security"
            >
              <SecurityTab
                sessionList={sortedSessions}
                currentSession={session?.session ?? null}
                isLoading={isLoading}
                error={fetchError as Error | null}
              />
            </TabsContent>
          </Tabs>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
