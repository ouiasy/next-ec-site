import {productImageTable, productTable} from "@/db/schema/product.schema";


export type SelectProductTable = typeof productTable.$inferSelect;
export type SelectProductImageTable = typeof productImageTable.$inferSelect;

export type GetLatestProductResponse = Pick<SelectProductTable,
    "name" | "slug" | "description" | "priceInTax"
    | "brand" | "rating" | "numReviews" | "stock" | "categoryId"
> & {
    imageUrls: string[] | null,
    imageNames: string[] | null,
}