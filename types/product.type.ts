import {product} from "@/db/schema/product.schema";
import {insertProductSchema} from "@/types/zod/product";
import {z} from "zod";

export type ProductType = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: number;
    createdAt: Date;
}