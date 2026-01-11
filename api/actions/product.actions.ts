"use server";

import {db} from "@/db";
import {desc, eq, sql} from "drizzle-orm";
import {categoryTable, productImageTable, productTable} from "@/db/schema/product.schema";
import {GetLatestProductsResponse, GetProductBySlugResponse} from "@/types/dto/response/product.actions.response";


export const getLatestProducts = async (): Promise<GetLatestProductsResponse[]> => {
  try {
    return await db.select({
      id: productTable.id,
      name: productTable.name,
      slug: productTable.slug,
      description: productTable.description,
      priceInTax: productTable.priceAfterTax,
      brand: productTable.brand,
      rating: productTable.rating,
      numReviews: productTable.numReviews,
      stock: productTable.stock,
      imageNames: sql<string[] | null>`array_agg
      (
      ${productImageTable.imageName}
      )`,
      imageUrls: sql<string[] | null>`array_agg
      (
      ${productImageTable.url}
      )`,
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


export const getProductBySlug = async (slug: string): Promise<GetProductBySlugResponse | null> => {
  console.log(slug)
  try {
    const [data] = await db.select({
      id: productTable.id,
      name: productTable.name,
      slug: productTable.slug,
      description: productTable.description,
      priceInTax: productTable.priceAfterTax,
      brand: productTable.brand,
      rating: productTable.rating,
      numReviews: productTable.numReviews,
      stock: productTable.stock,
      imageNames: sql<string[] | null>`array_agg
      (
      ${productImageTable.imageName}
      )`,
      imageUrls: sql<string[] | null>`array_agg
      (
      ${productImageTable.url}
      )`,
      category: categoryTable.name,
    }).from(productTable)
      .leftJoin(productImageTable, eq(productTable.id, productImageTable.productId))
      .where(eq(productTable.slug, slug))
      .limit(1)
      .leftJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
      .groupBy(productTable.id, categoryTable.name)

    if (data === undefined) return null;

    return data;
  } catch (e) {
    console.log("error fetching product by slug: ", e)
    return null
  }
};
