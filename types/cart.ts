import {insertCartSchema, cartItemSchema} from "@/zod/cart";
import {z} from "zod";

export type CartItemType = z.infer<typeof cartItemSchema>;
export type InsertToCartType = z.infer<typeof insertCartSchema>;