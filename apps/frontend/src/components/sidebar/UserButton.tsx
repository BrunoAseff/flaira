"use client";

import { auth } from "@/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowRightFromLine, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function UserButton() {
  const { data: session } = auth.useSession();
  const isMobile = useIsMobile();

  async function handleSignOut() {
    await auth.signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="py-6">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={session?.user.image ?? ""}
              alt={`${session?.user.name} profile picture`}
            />
            <AvatarFallback>
              <User />
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
        side={isMobile ? "right" : "top"}
        className="w-[--radix-popper-anchor-width] mb-4"
      >
        <DropdownMenuItem>
          <Settings />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <ArrowRightFromLine />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
