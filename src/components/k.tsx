"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "./ui/badge";


export default function GAuth() {  // Changed to capital 'G'
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <HoverCard>
      <HoverCardTrigger asChild>
        <button className="text-white p-2">{session.user?.email}</button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 mr-2 py-1">
        <div className="flex space-x-3">
        <Avatar>
          <AvatarImage src={session.user?.image} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

          <div className="space-y-1">
            <h4 className="text-sm font-semibold"></h4>
            <p className="text-sm">
              {session.user?.email}
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
              <Badge onClick={() => signOut()}>Sign out</Badge>
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>

      </>
    );
  }
  return (
    <>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </>
  );
}