import {insertCartSchema, cartItemSchema} from "@/zod/cart.zod";
import {z} from "zod";

export type CartItemType = z.infer<typeof cartItemSchema>;
export type InsertToCartType = z.infer<typeof insertCartSchema>;