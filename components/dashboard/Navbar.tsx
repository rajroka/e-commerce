"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  BubbleChatIcon,
  Search01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

const STROKE = 1.5;

function today() {
  return new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user      = session?.user;
  const userName  = user?.name  ?? "Admin";
  const userImage = (user as any)?.image as string | undefined;

  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-100 transition-all">
        <HugeiconsIcon icon={Search01Icon} size={14} color="#9ca3af" strokeWidth={STROKE} />
        <input
          type="text"
          placeholder="Search…"
          className="flex-1 text-sm bg-transparent text-gray-700 placeholder-gray-400 outline-none"
        />
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Date badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400">
            <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1 6h12" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {today()}
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-700">
          <HugeiconsIcon icon={Notification01Icon} size={18} color="currentColor" strokeWidth={STROKE} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full border-2 border-white" />
        </button>

        {/* Messages */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-700">
          <HugeiconsIcon icon={BubbleChatIcon} size={18} color="currentColor" strokeWidth={STROKE} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-100" />

        {/* User + logout */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-teal-100 flex items-center justify-center flex-shrink-0">
            {userImage ? (
              <Image src={userImage} alt={userName} width={32} height={32} className="object-cover" />
            ) : (
              <span className="text-xs font-bold text-teal-600">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">{userName}</span>
        </div>

        <button
          onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } })}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-xl text-sm font-medium transition-colors"
          title="Sign out"
        >
          <HugeiconsIcon icon={Logout01Icon} size={15} color="currentColor" strokeWidth={STROKE} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
