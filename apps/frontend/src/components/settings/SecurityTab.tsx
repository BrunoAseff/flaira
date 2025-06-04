"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { auth } from "@/auth/client";
import type { Session } from "better-auth/types";
import { format } from "date-fns";
import UserAgentDisplay from "@/lib/formatUserAgent";
import { Separator } from "../ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerPhoneSyncIcon,
  Loading02Icon,
  SquareArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { Banner } from "../ui/banner";

interface SecurityTabProps {
  sessionList: Session[] | null;
  currentSession: Session | null;
  isLoading: boolean;
  error: Error | null;
}

export default function SecurityTab({
  sessionList,
  currentSession,
  isLoading,
  error,
}: SecurityTabProps) {
  const [loadingSessionIds, setLoadingSessionIds] = useState<Set<string>>(
    new Set(),
  );
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const router = useRouter();
  const query = useQueryClient();

  const revokeSessionMutation = useMutation({
    mutationFn: async (params: { token: string; sessionId: string }) => {
      const response = await auth.revokeSession({ token: params.token });
      return { ...response.data, sessionId: params.sessionId };
    },
    onMutate: async (variables: { token: string; sessionId: string }) => {
      setLoadingSessionIds((prev) => new Set(prev).add(variables.sessionId));

      await query.cancelQueries({ queryKey: ["sessions"] });

      const previousSessions = query.getQueryData<Session[]>(["sessions"]);

      if (previousSessions) {
        query.setQueryData<Session[]>(
          ["sessions"],
          previousSessions.filter(
            (session: Session) => session.id !== variables.sessionId,
          ),
        );
      }

      return { previousSessions, sessionId: variables.sessionId };
    },
    onError: (
      err: Error & { sessionId?: string },
      _variables,
      context?: { previousSessions?: Session[]; sessionId: string },
    ) => {
      console.error("Failed to revoke session:", err);
      if (context?.previousSessions) {
        query.setQueryData<Session[]>(["sessions"], context.previousSessions);
      }
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["sessions"] });
    },
    onSettled: (_data, error, variables, context) => {
      const sessionIdToClear =
        variables.sessionId || error?.sessionId || context?.sessionId;
      if (sessionIdToClear) {
        setLoadingSessionIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(sessionIdToClear);
          return newSet;
        });
      }
    },
  });

  async function handleRevokeSession(token: string, sessionId: string) {
    revokeSessionMutation.mutate({ token, sessionId });
  }

  if (error) {
    return (
      <div className="w-full mt-12 flex flex-col h-full items-center justify-center">
        <Banner variant="error">We could not load the content</Banner>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <ScrollArea className="flex-1 pb-16 max-h-[85vh] scrollbar-gutter-stable overflow-y-auto">
        <div className="w-full py-0 px-4 pb-10">
          <div className="w-full flex flex-col gap-6">
            <div className="flex w-full justify-between">
              <h1 className="text-base font-bold text-foreground/90">
                Password
              </h1>
              <Button
                onClick={() => router.push("/forgot-password")}
                size="sm"
                variant="outline"
              >
                Reset password
              </Button>
            </div>
            <Separator />
            <div className="flex flex-col w-full justify-between gap-6">
              <h1 className="text-base font-bold text-foreground/90">
                Sessions
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">
                {isLoading && (
                  <>
                    <Skeleton className="flex w-full h-[4.651rem] items-center justify-between relative rounded-lg p-3" />
                    <Skeleton className="flex w-full h-[4.651rem] items-center justify-between relative rounded-lg p-3" />
                  </>
                )}
                {!isLoading &&
                  sessionList?.map((session) => (
                    <div
                      key={session.id}
                      className="flex w-full items-center justify-between relative border border-muted rounded-lg bg-popover p-3"
                    >
                      <div className="flex items-center gap-3">
                        <HugeiconsIcon
                          icon={ComputerPhoneSyncIcon}
                          className="text-accent-foreground"
                          color="currentColor"
                          strokeWidth={2}
                          size={42}
                        />
                        <div className="flex flex-col gap-1">
                          <div className="text-foreground/65 font-semibold text-sm flex gap-3 items-center">
                            <UserAgentDisplay
                              userAgent={session.userAgent ?? ""}
                            />
                            {currentSession?.id === session.id ? (
                              <>
                                <div className="text-xs md:hidden flex absolute -top-3 -left-3 w-fit bg-primary-foreground text-primary font-bold p-1 rounded-md">
                                  Current device
                                </div>
                                <div className="text-xs hidden md:flex top- w-fit bg-primary-foreground text-primary font-bold p-1 rounded-md">
                                  Current device
                                </div>
                              </>
                            ) : null}
                          </div>

                          <div className="text-foreground/65 font-semibold text-sm">
                            {format(
                              new Date(session.createdAt),
                              "dd/MM/yyyy 'at' HH:mm",
                            )}
                          </div>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          {currentSession?.id !== session.id ? (
                            <Button
                              onClick={() =>
                                handleRevokeSession(session.token, session.id)
                              }
                              className="text-muted-foreground transition-all duration-300 hover:text-error hover:bg-error/10"
                              variant="ghost"
                              disabled={
                                loadingSessionIds.has(session.id) ||
                                (revokeSessionMutation.isPending &&
                                  loadingSessionIds.has(session.id))
                              }
                              size="icon"
                            >
                              <HugeiconsIcon
                                className={cn(
                                  loadingSessionIds.has(session.id) &&
                                    "animate-spin",
                                )}
                                icon={
                                  loadingSessionIds.has(session.id)
                                    ? Loading02Icon
                                    : SquareArrowRight02Icon
                                }
                                color="currentColor"
                                strokeWidth={2}
                              />
                            </Button>
                          ) : (
                            <div className="size-10" />
                          )}
                        </TooltipTrigger>
                        {currentSession?.id !== session.id && (
                          <TooltipContent>Remove session</TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                  ))}
                {!isLoading && sessionList && sessionList.length === 0 && (
                  <p className="text-foreground/65 text-sm">
                    No active sessions found.
                  </p>
                )}
              </div>
            </div>
            <Separator />
            <div className="flex w-full justify-between">
              <h1 className="text-base font-bold text-foreground/90">
                Delete account
              </h1>
              <Button
                onClick={() => setIsDeleteAccountOpen(true)}
                size="sm"
                variant="destructive"
              >
                Delete account
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
      <DeleteAccountDialog
        isOpen={isDeleteAccountOpen}
        setIsOpen={setIsDeleteAccountOpen}
      />
    </div>
  );
}
