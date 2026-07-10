import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  fetchOptions: {
    // Let the browser use its HTTP cache for get-session responses
    // (better-auth sets appropriate cache headers when cookieCache is on)
    cache: 'default',
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
