import {productTable} from "@/db/schema/product.schema";

export type SelectProductTable = typeof productTable.$inferSelect;