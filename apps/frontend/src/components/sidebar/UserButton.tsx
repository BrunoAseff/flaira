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
  Settings01Icon,
  User03Icon,
} from "@hugeicons/core-free-icons";

export default function UserButton() {
  const { data: session } = auth.useSession();
  const isMobile = useIsMobile();

  async function handleSignOut() {
    await auth.signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="py-6 hover:bg-background">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage
              src={session?.user.image ?? ""}
              alt={`${session?.user.name} profile picture`}
            />
            <AvatarFallback className="text-foreground/70">
              <HugeiconsIcon
                icon={User03Icon}
                color="currentColor"
                strokeWidth={2}
              />{" "}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-left w-full">
            <h2>{session?.user.name}</h2>
            <h2 className="text-sm text-muted-foreground">
              {session?.user.email}
            </h2>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "top" : "right"}
        className="w-[--radix-popper-anchor-width] mb-4"
      >
        <DropdownMenuItem>
          <HugeiconsIcon
            className="text-foreground/70"
            icon={Settings01Icon}
            color="currentColor"
            strokeWidth={2}
          />{" "}
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <HugeiconsIcon
            className="text-foreground/70"
            icon={Login01Icon}
            color="currentColor"
            strokeWidth={2}
          />{" "}
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
