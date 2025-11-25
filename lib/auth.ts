import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { nanoid } from "nanoid";
import {SERVER_URL} from "@/lib/constants";

export const auth = betterAuth({
  baseURL: SERVER_URL,
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => nanoid(),
    },
  },
});
