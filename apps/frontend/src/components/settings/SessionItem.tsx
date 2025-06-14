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
  const isCurrentSession = currentSession?.id === session.id;
  const isLoading = loadingSessionIds.has(session.id);
  const isDisabled =
    isLoading || (revokeSessionMutation.isPending && isLoading);

  const renderButton = () => {
    if (isCurrentSession) {
      return <div className="size-10" />;
    }

    return (
      <Button
        onClick={() => handleRevokeSession(session.token, session.id)}
        className="text-muted-foreground transition-all duration-300 hover:text-error hover:bg-error/10"
        variant="ghost"
        aria-label="Revoke session"
        disabled={isDisabled}
        size="icon"
      >
        <HugeiconsIcon
          className={cn(isLoading && "animate-spin")}
          icon={isLoading ? Loading02Icon : SquareArrowRight02Icon}
          color="currentColor"
          strokeWidth={2}
        />
      </Button>
    );
  };

  if (isMobile) {
    return renderButton();
  }

  return (
    <Tooltip>
      <TooltipTrigger>{renderButton()}</TooltipTrigger>
      {!isCurrentSession && <TooltipContent>Remove session</TooltipContent>}
    </Tooltip>
  );
}
