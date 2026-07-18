"use client";

/**
 * AuthProvider — compatibility shim.
 *
 * better-auth is cookie-based and does not require a React context provider.
 * This component is kept as a passthrough so any legacy import sites continue
 * to compile without changes.
 */
import { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}


