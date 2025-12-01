
import {insertProductSchema} from "@/zod/product.zod";
import {z} from "zod";

export type ProductType = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: number;
    createdAt: Date;
}