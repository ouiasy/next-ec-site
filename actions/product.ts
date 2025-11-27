"use server";

import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { products } from "@/db/schema/product.schema";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

export const getLatestProducts = async () => {
  const data = await db.query.products.findMany({
    limit: LATEST_PRODUCTS_LIMIT,
    orderBy: [desc(products.createdAt)],
  });
  data.map((product) => {
    if (product.images) {
      product.images = JSON.parse(product.images);
    }
  });
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const data = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
  if (!data) return;
  data.images = JSON.parse(data.images);

  return data;
};
