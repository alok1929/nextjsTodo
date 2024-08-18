"use client";

import { Image } from "@radix-ui/react-avatar";

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
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
           <div className="bg-none">
           <Avatar>
              <AvatarImage src={session.user?.image}   className="bg-none"/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
           </div>
            </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-4 py-2">
            <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>

              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownMenuSub>
                  Github

                </DropdownMenuSub>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button onClick={() => signOut()}>Sign Out</button>

              </DropdownMenuItem>
            </DropdownMenuGroup>

          </DropdownMenuContent>
        </DropdownMenu>

      </>
    );
  }
  return (
    <>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </>
  );
}