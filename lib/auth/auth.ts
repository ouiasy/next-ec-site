import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@/db";
import {nanoid} from "nanoid";
import {SERVER_URL} from "@/lib/constants";
import {nextCookies} from "better-auth/next-js";
import {admin, anonymous, jwt} from "better-auth/plugins"
import {cartTable} from "@/db/schema/cart.schema";
import {eq} from "drizzle-orm";

export const auth = betterAuth({
  baseURL: SERVER_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "jwt",
    }
  },
  advanced: {
    database: {
      generateId: () => nanoid(),
    },
  },
  plugins: [
    nextCookies(),
    jwt(),
    admin(),
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser}) => {
        // await db.update(carts)
        //     .set({ userId: newUser.id })
        //     .where(eq(carts.userId, anonymousUser.id))
        //
        // console.log(`Migrated cart from ${anonymousUser.id} to ${newUser.id}`)
      }
    })
  ]
});
