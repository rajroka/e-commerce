"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/**
 * Sign-out button — uses better-auth.
 */
export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () =>
    signOut({ fetchOptions: { onSuccess: () => router.push("/") } });

  return (
    <button
      onClick={handleSignOut}
      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}


