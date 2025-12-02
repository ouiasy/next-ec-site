import {cartTable} from "@/db/schema/cart.schema";

export type SelectCartTable = typeof cartTable.$inferSelect;
