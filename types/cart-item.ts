import {insertCartSchema, cartItemSchema} from "@/zod/cart-item";
import {z} from "zod";

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema>;