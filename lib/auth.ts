import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// Import MongoClient from the same mongodb package that better-auth resolves,
// ensuring both share the same bson instance and avoiding BSONVersionError.
import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables.");
}

const uri = process.env.MONGO_URI;

// Reuse client across hot reloads in development
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

export const auth = betterAuth({
  database: mongodbAdapter(db),

  trustedOrigins: ["http://localhost:3001"],

  session: {
    // Store session data in a short-lived signed cookie so useSession / getSession
    // resolves instantly without hitting MongoDB on every request.
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes — revalidates against DB only when this expires
    },
    // Defer DB writes on GET /get-session (refresh happens via POST instead)
    deferSessionRefresh: true,
  },

  plugins: [nextCookies()],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
    },
  },
});
