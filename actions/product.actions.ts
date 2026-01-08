"use server";

import { db } from "@/db";
import {desc, eq, sql} from "drizzle-orm";
import { productImageTable, productTable } from "@/db/schema/product.schema";
import { GetLatestProductResponse, SelectProductTable } from "@/types/dto/response/product.type.response";


export const getLatestProducts = async (): Promise<GetLatestProductResponse[]> => {
  try {
    return await db.select({
      id: productTable.id,
      name: productTable.name,
      slug: productTable.slug,
      categoryId: productTable.categoryId,
      description: productTable.description,
      priceInTax: productTable.priceInTax,
      brand: productTable.brand,
      rating: productTable.rating,
      numReviews: productTable.numReviews,
      stock: productTable.stock,
      imageNames: sql<string[] | null>`array_agg(${productImageTable.imageName})`,
      imageUrls: sql<string[] | null>`array_agg(${productImageTable.url})`,
    }).from(productTable)
      .leftJoin(productImageTable, eq(productTable.id, productImageTable.productId))
      .groupBy(productTable.id)
      .orderBy(desc(productTable.createdAt))
        .limit(4)
  } catch (e) {
    console.log("error fetching latest products: ", e)
    return []
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const data: SelectProductTable | undefined = await db.query.productTable.findFirst({
      where: eq(productTable.slug, slug),
    });
    if (data === undefined) return null;

    return data;
  } catch (e) {
    console.log("error fetching product by slug: ", e)
    return null
  }
};
