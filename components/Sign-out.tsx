'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
