"use server";

import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { productTable } from "@/db/schema/product.schema";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import {SelectProductTable} from "@/types/dabatase/product.types";

type GetLatestProductResult = SelectProductTable;

export const getLatestProducts = async (): Promise<GetLatestProductResult[] | null> => {
  try {
    const data: SelectProductTable[] = await db.query.productTable.findMany({
      limit: LATEST_PRODUCTS_LIMIT,
      orderBy: [desc(productTable.createdAt)],
    });
    return data;
  } catch (e) {
    console.log("error fetching latest products: ", e)
    return null
  }

};

export const getProductBySlug = async (slug: string): Promise<SelectProductTable | null> => {
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
