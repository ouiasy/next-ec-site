import { createInsertSchema } from "drizzle-zod";
import { products } from "@/db/schema/product.schema";
import { z } from "zod";

export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(3, "name must be at least 3 chars"),
  slug: z.string().min(3, "slug must be at least 3 chars"),
  category: z.string().min(3, "category must be at least 3 chars"),
  brand: z.string().min(3, "category must be at least 3 chars"),
  description: z.string().min(3, "description must be at least 3 chars"),
  stock: z.coerce.number().min(0, "stock should be plus number"),
  images: z.array(z.string()).min(1, "product must have at least one image.."),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: z.number().min(0, "price should be over 0"),
}).omit({
  id: true,
  createdAt: true,
});
