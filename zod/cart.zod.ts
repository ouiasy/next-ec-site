import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1, "productid is required"),
  name: z.string().min(1, "name is required"),
  slug: z.string().min(1, "slug is required"),
  qty: z
    .number()
    .int()
    .nonnegative("quantity must be a positive number")
    .optional(),
  image: z.string().min(1, "image is required"),
  price: z.number().nonnegative("price must be a positive number"),
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: z.number().nonnegative("items' price must be a positive number"),
  totalPrice: z.number().nonnegative("total price must be a positive number"),
  shippingPrice: z
    .number()
    .nonnegative("shipping price must be a positive number"),
  taxPrice: z.number().nonnegative("tax price must be a positive number"),
  sessionCartId: z.string().min(1, "session cart id is required"),
  userId: z.string().optional().nullable(),
});
