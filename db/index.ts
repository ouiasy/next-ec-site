import {createClient} from "@libsql/client";
import {drizzle} from "drizzle-orm/libsql";
import * as productSchema from "./schema/product"
import * as userSchema from "./schema/users";
import * as cartSchema from "./schema/cart-item";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
})
export const db = drizzle({
  client: client,
  schema: {
    ...productSchema,
    ...userSchema,
    ...cartSchema,
  },
  casing: "snake_case",
})


