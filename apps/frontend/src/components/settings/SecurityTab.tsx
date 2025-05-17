"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { auth } from "@/auth/client";
import type { Session } from "better-auth/types";
import { format } from "date-fns";
import FormatUserAgent from "@/lib/formatUserAgent";
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

export default function SecurityTab() {
  const [sessionList, setSessionList] = useState<Session[] | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [loadingSessionIds, setLoadingSessionIds] = useState<Set<string>>(
    new Set(),
  );
  const [isFetching, setIsFetching] = useState(true);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const router = useRouter();
  async function getSessionList() {
    const sessionsData = await auth.listSessions();
    setSessionList(sessionsData.data);
    setIsFetching(false);

    const currentSessionData = await auth.getSession();
    setCurrentSession(currentSessionData.data?.session ?? null);
  }

  // biome-ignore lint:
  useEffect(() => {
    getSessionList();
  }, []);

  async function handleRevokeSession(token: string, sessionId: string) {
    setLoadingSessionIds((prev) => new Set(prev).add(sessionId));

    await auth.revokeSession(
      {
        token,
      },
      {
        onSuccess: () => {
          setLoadingSessionIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(sessionId);
            return newSet;
          });

          getSessionList();
        },
      },
    );
  }

  return (
    <div className="w-full h-full">
      <ScrollArea className="flex-1 overflow-y-auto">
        {" "}
        <div className="px-10 pb-10 w-full">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {isFetching && (
                  <>
                    <Skeleton className="flex w-full h-24 items-center justify-between relative rounded-lg p-3" />
                    <Skeleton className="flex w-full h-24 items-center justify-between relative rounded-lg p-3" />
                  </>
                )}
                {!isFetching &&
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
                          {currentSession?.id === session.id ? (
                            <div className="text-xs w-fit bg-primary-foreground text-primary font-bold p-1 rounded-md">
                              Current device
                            </div>
                          ) : null}
                          <div className="text-foreground/65 font-semibold text-sm flex">
                            <FormatUserAgent
                              userAgent={session.userAgent ?? ""}
                            />
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
                              disabled={loadingSessionIds.has(session.id)}
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
                            <div />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>Remove session</TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
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
