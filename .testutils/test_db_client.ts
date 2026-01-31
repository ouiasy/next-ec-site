import { drizzle } from "drizzle-orm/node-postgres";

import * as addressSchema from "@/db/schema/address.schema";
import * as cartSchema from "@/db/schema/cart.schema";
import * as orderSchema from "@/db/schema/order.schema";
import * as productSchema from "@/db/schema/product.schema";
import * as userSchema from "@/db/schema/user.schema";

export const testDB = drizzle(process.env.TEST_DB_URL!, {
	schema: {
		...productSchema,
		...userSchema,
		...cartSchema,
		...addressSchema,
		...orderSchema,
	},
	casing: "snake_case",
});
