"use client";

import { auth } from "@/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowRightFromLine, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";

export default function UserButton() {
  const { data: session } = auth.useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
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
        side="right"
        className="w-[--radix-popper-anchor-width] mb-4"
      >
        <DropdownMenuItem>
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex w-full justify-between"
          variant="destructive"
        >
          <span>Sign out</span>
          <ArrowRightFromLine />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
