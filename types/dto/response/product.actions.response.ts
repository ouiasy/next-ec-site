import {productImageTable, productTable} from "@/db/schema/product.schema";


export type SelectProductTable = typeof productTable.$inferSelect;
export type SelectProductImageTable = typeof productImageTable.$inferSelect;

export type GetLatestProductsResponse = Pick<SelectProductTable,
    "name" | "slug" | "description" | "priceInTax"
    | "brand" | "rating" | "numReviews" | "stock"
> & {
    imageUrls: string[] | null,
    imageNames: string[] | null,
}

export type GetProductBySlugResponse = Pick<SelectProductTable,
    "id"|"name" | "slug" | "description" | "priceInTax" | "brand" |
    "rating" | "numReviews" | "stock"
> & {
    imageNames: string[] | null,
    imageUrls: string[] | null,
    category: string | null,
}