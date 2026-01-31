import { drizzle } from "drizzle-orm/node-postgres";
import * as addressSchema from "./schema/address.schema";
import * as cartSchema from "./schema/cart.schema";
import * as orderSchema from "./schema/order.schema";
import * as productSchema from "./schema/product.schema";
import * as userSchema from "./schema/user.schema";

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

export type DB =
	| Parameters<Parameters<typeof db.transaction>[0]>[0]
	| typeof db;
