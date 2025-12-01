"use server";

import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { productTable } from "@/db/schema/product.schema";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import {SelectProductTable} from "@/types/dabatase/product.types";

type GetLatestProductResult = Omit<SelectProductTable, "images"> & {
  images: string[],
}

export const getLatestProducts = async (): Promise<GetLatestProductResult[]> => {
  const data: SelectProductTable[] = await db.query.productTable.findMany({
    limit: LATEST_PRODUCTS_LIMIT,
    orderBy: [desc(productTable.createdAt)],
  });
  console.log(data)
  data.map((product) => {
    if (product.images) {
      product.images = JSON.parse(product.images);
    }
  });
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const data = await db.query.productTable.findFirst({
    where: eq(productTable.slug, slug),
  });
  if (!data) return;
  data.images = JSON.parse(data.images);

  return data;
};
