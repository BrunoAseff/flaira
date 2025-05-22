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

export function SettingsDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const {
    data: currentSessionData,
    isLoading: isLoadingCurrentSession,
    error: currentSessionError,
  } = useQuery({
    queryKey: ["currentSession"],
    queryFn: async () => {
      const response = await auth.getSession();
      if (response.error) throw response.error;
      return response.data?.session ?? null;
    },
    enabled: isOpen,
  });

  const currentSessionId = currentSessionData?.id ?? null;

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
      if (a.id === currentSessionId) return -1;
      if (b.id === currentSessionId) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [sessionsData, currentSessionId]);

  const isLoading = isLoadingCurrentSession || isLoadingSessions;
  const fetchError = currentSessionError || sessionsError;

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
              tabIndex={-1}
              className="w-full flex-1 h-full overflow-hidden pl-4"
              value="profile"
            >
              <div className="flex flex-col min-h-[80vh] items-center justify-center">
                Profile Tab Content
              </div>
            </TabsContent>

            <TabsContent
              tabIndex={-1}
              className="w-full flex-1 h-full overflow-hidden pl-4"
              value="security"
            >
              <SecurityTab
                sessionList={sortedSessions}
                currentSession={currentSessionData ?? null}
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
