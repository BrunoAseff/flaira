import { useIsMobile } from "@/hooks/use-mobile";
import {
  Loading02Icon,
  SquareArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { Session } from "better-auth/types";

interface SessionItemProps {
  session: Session;
  currentSession: Session | null;
  loadingSessionIds: Set<string>;
  revokeSessionMutation: {
    isPending: boolean;
  };
  handleRevokeSession: (token: string, sessionId: string) => void;
}

export function SessionItem({
  session,
  currentSession,
  loadingSessionIds,
  revokeSessionMutation,
  handleRevokeSession,
}: SessionItemProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Tooltip>
        <TooltipTrigger>
          {currentSession?.id !== session.id ? (
            <Button
              onClick={() => handleRevokeSession(session.token, session.id)}
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
                  loadingSessionIds.has(session.id) && "animate-spin",
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
    );
  }

  return (
    <div>
      {currentSession?.id !== session.id ? (
        <Button
          onClick={() => handleRevokeSession(session.token, session.id)}
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
            className={cn(loadingSessionIds.has(session.id) && "animate-spin")}
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
    </div>
  );
}
