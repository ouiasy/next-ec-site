import {product} from "@/db/schema/product";
import {insertProductSchema} from "@/types/zod/product";
import {z} from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: number;
    createdAt: Date;
}