import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Cancel01Icon,
  Loading01Icon,
  PaintBrush01Icon,
  User03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { User } from 'better-auth/types';

interface AvatarDisplayProps {
  displayImageSrc: string | null;
  user: User | null;
  isActionPending: boolean;
  isImageUrlLoading: boolean;
  optimisticAvatarUrl: string | null;
  uploadAvatarMutation: UseMutationResult<unknown, Error, File, unknown>;
  showRemoveOption: boolean;
  onUpdateAvatarClick: () => void;
  onRemoveAvatarClick: () => void;
}

export default function AvatarDisplay({
  displayImageSrc,
  user,
  isActionPending,
  isImageUrlLoading,
  optimisticAvatarUrl,
  uploadAvatarMutation,
  showRemoveOption,
  onUpdateAvatarClick,
  onRemoveAvatarClick,
}: AvatarDisplayProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isActionPending}>
        <div className="relative group cursor-pointer">
          <Avatar className="size-24 border-1 border-accent shadow-xl">
            <AvatarImage
              src={displayImageSrc || ''}
              alt={`${user?.name || 'User'}'s profile picture`}
              key={displayImageSrc}
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="text-foreground size-full">
              {isImageUrlLoading && !optimisticAvatarUrl ? (
                <HugeiconsIcon
                  icon={Loading01Icon}
                  className="animate-spin text-primary"
                  size={32}
                />
              ) : (
                <HugeiconsIcon
                  icon={User03Icon}
                  color="currentColor"
                  strokeWidth={1.5}
                  size={48}
                />
              )}
            </AvatarFallback>
          </Avatar>
          {!isActionPending && !optimisticAvatarUrl && (
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center bg-primary-foreground text-primary rounded-full',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              )}
            >
              <HugeiconsIcon icon={PaintBrush01Icon} size={32} />
            </div>
          )}
          {uploadAvatarMutation.isPending && optimisticAvatarUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/60 rounded-full">
              <HugeiconsIcon
                icon={Loading01Icon}
                className="animate-spin text-primary"
                size={32}
              />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem
          onClick={onUpdateAvatarClick}
          disabled={isActionPending}
          className="group flex items-center gap-2"
        >
          <HugeiconsIcon
            icon={PaintBrush01Icon}
            className="text-foreground/70 group-hover:text-foreground"
            strokeWidth={2}
            size={18}
          />
          <span>Update avatar</span>
        </DropdownMenuItem>

        {showRemoveOption && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onRemoveAvatarClick}
              disabled={isActionPending}
              className="group flex items-center gap-2"
              variant="destructive"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} size={18} />
              <span>Remove avatar</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
