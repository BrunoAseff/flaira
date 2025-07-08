"use client";

import { auth } from "@/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Login01Icon,
  User03Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { SettingsDialog } from "../settings/SettingsDialog";
import { useQuery } from "@tanstack/react-query";

export default function UserButton() {
  const { data: session } = auth.useSession();
  const isMobile = useIsMobile();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  async function handleSignOut() {
    await auth.signOut();
  }

  const { data: imageUrl } = useQuery({
    queryKey: ["avatar-url", session?.user.image],
    queryFn: async () => {
      if (!session?.user.image) {
        return null;
      }

      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/user/get-avatar`);
      url.searchParams.append("key", session.user.image);

      const presignedUrlResponse = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!presignedUrlResponse.ok) {
        throw new Error(
          `Failed to fetch avatar URL: ${presignedUrlResponse.status}`,
        );
      }

      const presignedUrlData = await presignedUrlResponse.json();
      return presignedUrlData.data || null;
    },
    enabled: !!session && !!session.user.image,
    staleTime: Number.POSITIVE_INFINITY,
    retry: 2,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton size="lg" className="py-6 hover:bg-background">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage
                src={imageUrl ?? ""}
                alt={`${session?.user.name} profile picture`}
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="text-foreground/70">
                <HugeiconsIcon
                  icon={User03Icon}
                  color="currentColor"
                  strokeWidth={2}
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-left text-ellipsis w-full">
              <h2 className="text-ellipsis overflow-hidden whitespace-nowrap">
                {session?.user.name}
              </h2>
              <h2 className="text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                {session?.user.email}
              </h2>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={isMobile ? "top" : "right"}
          className="w-[--radix-popper-anchor-width] mb-4"
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setIsSettingsOpen(true);
            }}
          >
            <HugeiconsIcon
              className="text-foreground/70"
              icon={Settings01Icon}
              color="currentColor"
              strokeWidth={2}
            />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <HugeiconsIcon
              className="text-foreground/70"
              icon={Login01Icon}
              color="currentColor"
              strokeWidth={2}
            />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
    </>
  );
}
