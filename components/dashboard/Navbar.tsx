"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin";

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };

  return (
    <header className="w-full bg-white border-b px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600 hidden md:block">
          Welcome, {userName}
        </p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
