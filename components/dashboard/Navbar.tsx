"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { Bell, MessageSquare, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

function today() {
  return new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const userName  = session?.user?.name  ?? "Admin";
  const userImage = (session?.user as any)?.image as string | undefined;

  return (
    <TooltipProvider>
      <header className="w-full bg-white border-b border-border px-6 py-3 flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <Input placeholder="Search…" className="h-8 text-sm" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Date badge */}
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 text-muted-foreground font-normal">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M1 6h12" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {today()}
          </Badge>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          {/* Messages */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MessageSquare size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Messages</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* User */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border flex items-center justify-center flex-shrink-0">
              {userImage
                ? <Image src={userImage} alt={userName} width={32} height={32} className="object-cover" />
                : <span className="text-xs font-bold text-gray-600">{userName.charAt(0).toUpperCase()}</span>
              }
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">{userName}</span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-red-600"
                onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } })}
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sign out</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
