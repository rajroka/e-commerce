import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// ─── Environment validation ────────────────────────────────────────────────────
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables.");
}
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not defined in environment variables.");
}

const uri = process.env.MONGO_URI;

// ─── MongoDB client (reused across hot reloads in dev) ─────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var _betterAuthMongoClient: MongoClient | undefined;
}

let mongoClient: MongoClient;

if (process.env.NODE_ENV === "development") {
  if (!global._betterAuthMongoClient) {
    global._betterAuthMongoClient = new MongoClient(uri);
    await global._betterAuthMongoClient.connect();
  }
  mongoClient = global._betterAuthMongoClient;
} else {
  mongoClient = new MongoClient(uri);
  await mongoClient.connect();
}

const db = mongoClient.db();

// ─── Resolve base URL ─────────────────────────────────────────────────────────
// On Vercel, VERCEL_URL is set to the deployment URL (without protocol).
// We prefer the explicit BETTER_AUTH_URL (set in env) for production,
// and fall back to VERCEL_URL for preview deployments.
function resolveBaseUrl(): string {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_URL)      return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// ─── Better Auth instance ──────────────────────────────────────────────────────
export const auth = betterAuth({
  database: mongodbAdapter(db),

  // Base URL — used to construct OAuth redirect URIs and cookie domain
  baseURL: resolveBaseUrl(),

  // Allow requests from these origins.
  // On Vercel: production URL + all preview deployments under the same project.
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    // Production URL (from env)
    ...(process.env.NEXT_PUBLIC_BASE_URL
      ? [process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")]
      : []),
    // Vercel preview deployments — matches any *.vercel.app URL for this project.
    // The wildcard pattern is supported by better-auth's origin check.
    "https://*.vercel.app",
  ],

  // ─── Session ──────────────────────────────────────────────────────────────
  session: {
    // Short-lived signed cookie avoids a DB round-trip on every request.
    // The cookie is re-validated against MongoDB when it expires.
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    // Defer DB session-refresh writes to the POST endpoint rather than every GET
    deferSessionRefresh: true,
    // Persistent sessions: 30-day sliding window
    expiresIn: 60 * 60 * 24 * 30,        // 30 days (seconds)
    updateAge:  60 * 60 * 24,            // extend by 1 day on activity
  },

  // ─── Secure cookie settings ───────────────────────────────────────────────
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    // Keep the default "better-auth" prefix so existing sessions remain valid.
    // Changing the prefix invalidates all active session cookies.
  },

  // ─── Social OAuth providers ───────────────────────────────────────────────
  socialProviders: {
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // On first login: create user with role=customer
      // On subsequent logins: update existing record (handled by better-auth internally)
    },
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId:     process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },

  // ─── Email + password ─────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    // Minimum 8 characters enforced on the client; re-validated server-side
    minPasswordLength: 8,
  },

  // ─── RBAC: custom role field ──────────────────────────────────────────────
  // Roles stored directly on the `user` document in MongoDB.
  // Valid values: "admin" | "customer"
  // New users always receive "customer" by default.
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        // Prevent clients from setting an arbitrary role via the API
        input: false,
      },
    },
  },

  // ─── Plugins ─────────────────────────────────────────────────────────────
  plugins: [
    // nextCookies() reads/writes cookies via next/headers so server components
    // and server actions can access the session without a custom cookie jar.
    nextCookies(),
  ],

  // ─── Hooks: upsert user on OAuth login ───────────────────────────────────
  // better-auth already handles create-on-first-login and update-on-subsequent
  // logins via its OAuth account linking logic. The databaseHooks below add
  // extra safety: ensure every new user has a role.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              // Guarantee role is set even if the defaultValue logic is bypassed
              role: (user as any).role ?? "customer",
            },
          };
        },
      },
    },
  },
});

// ─── Convenience export: inferred auth types ─────────────────────────────────
// Use (session.user as BetterAuthUser).role for typed access in server code.
export type BetterAuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "customer" | "user";
};
