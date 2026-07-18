"use client";

import { signIn } from "@/lib/auth-client";

/**
 * Sign-in button — uses better-auth Google OAuth.
 * Kept for legacy import compatibility; prefer the full sign-in page.
 */
export default function SignIn() {
  return (
    <button onClick={() => signIn.social({ provider: "google" })}>
      Sign In with Google
    </button>
  );
}


