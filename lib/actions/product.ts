"use server";

import {db} from "@/db"
import {desc} from "drizzle-orm";
import {product} from "@/db/schema/product";
import {LATEST_PRODUCTS_LIMIT} from "@/lib/constants";


export const getLatestProducts = async () => {
    const data = await db.query.product.findMany({
        limit: LATEST_PRODUCTS_LIMIT,
        orderBy: [desc(product.createdAt)]
    })
    data.map((product) => {
        if (product.images) {
            product.images = JSON.parse(product.images)
        }
        console.log(product.images)
    })
    return data
}