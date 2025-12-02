import { cartTable } from "@/db/schema/cart.schema";
import { insertCartSchema, cartItemSchema } from "@/zod/cart.zod";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export type CartItemPayload = z.infer<typeof cartItemSchema>;


export type InsertToCartType = z.infer<typeof insertCartSchema>;

