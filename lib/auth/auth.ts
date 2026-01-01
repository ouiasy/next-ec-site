import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@/db";
import {nanoid} from "nanoid";
import {SERVER_URL} from "@/lib/constants";
import {nextCookies} from "better-auth/next-js";
import {admin, anonymous, jwt} from "better-auth/plugins"
import { mergeAnonymousCart } from "@/lib/services/cart";

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
        const anonymousId = anonymousUser.user.id;
        const newUserId = newUser.user.id;

        try {
          await mergeAnonymousCart(anonymousId, newUserId)

        } catch (e) {
          console.log("error while migrating cart: ", e)
        }

        console.log(`Migrated cart from ${anonymousUser.user.id} to ${newUser.user.id}`)
      }
    })
  ]
});
