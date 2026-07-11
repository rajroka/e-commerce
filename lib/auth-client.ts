import { createAuthClient } from "better-auth/react";

// ─── Typed auth client ────────────────────────────────────────────────────────
// better-auth/react's createAuthClient does not accept a generic type parameter
// directly — the session shape is inferred at runtime from the server config.
// We export a typed SessionUser below by narrowing useSession's return.
export const authClient = createAuthClient({
  fetchOptions: {
    // Honour the HTTP cache headers better-auth sets when cookieCache is enabled.
    // Repeated useSession() calls within the 5-minute window won't hit the network.
    cache: "default",
  },
});

// ─── Named exports used throughout the app ────────────────────────────────────
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

// ─── Convenience type: session user shape (with our custom role field) ─────────
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "customer" | "user";
  [key: string]: unknown;
};
