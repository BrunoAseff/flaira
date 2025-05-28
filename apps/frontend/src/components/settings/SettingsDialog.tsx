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
import { cn } from "@/lib/utils";

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
            className="flex flex-col md:flex-row w-full h-full"
            defaultValue="profile"
            orientation="horizontal"
          >
            <TabsList
              className={cn(
                "flex-shrink-0 bg-transparent gap-3 my-3 w-full md:w-44 justify-center md:justify-start",
                "flex-row md:flex-col mt-6 md:mt-0 md:pr-4 mb-4 md:mb-0",
              )}
            >
              <TabsTrigger
                value="profile"
                className="flex-col sm:flex-row items-center px-4 py-3 text-xl md:text-base"
              >
                <HugeiconsIcon
                  icon={UserSquareIcon}
                  color="currentColor"
                  strokeWidth={2}
                  size={20}
                  className="size-8 sm:size-6"
                />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex-col sm:flex-row items-center px-4 py-3 text-xl md:text-base"
              >
                <HugeiconsIcon
                  icon={LockKeyIcon}
                  color="currentColor"
                  strokeWidth={2}
                  size={20}
                  className="size-8 sm:size-6"
                />
                Security
              </TabsTrigger>
            </TabsList>

            <Separator
              orientation="vertical"
              className="h-auto hidden md:block mx-2 md:mx-4"
            />

            <div className="flex-1 w-full h-full overflow-y-auto">
              <TabsContent
                className="w-full h-full mt-12 md:mt-0 outline-none ring-0 focus-visible:ring-0 focus-visible:outline-none :pl-2 lg:pl-4"
                value="profile"
              >
                <ProfileTab user={session?.user ?? null} error={null} />
              </TabsContent>
              <TabsContent
                className="w-full h-full mt-12 md:mt-0 outline-none ring-0 focus-visible:ring-0 focus-visible:outline-none  md:pl-2 lg:pl-4"
                value="security"
              >
                <SecurityTab
                  sessionList={sortedSessions}
                  currentSession={session?.session ?? null}
                  isLoading={isLoading}
                  error={fetchError instanceof Error ? fetchError : null}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
