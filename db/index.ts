
import { drizzle } from "drizzle-orm/node-postgres";
import * as productSchema from "./schema/product.schema";
import * as userSchema from "./schema/user.schema";
import * as cartSchema from "./schema/cart.schema";
import * as addressSchema from "./schema/address.schema";
import * as orderSchema from "./schema/order.schema"


export const db = drizzle(process.env.DB_URL!, {
  schema: {
    ...productSchema,
    ...userSchema,
    ...cartSchema,
    ...addressSchema,
    ...orderSchema,
  },
  casing: "snake_case",
});
