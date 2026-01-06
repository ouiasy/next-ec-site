import "dotenv/config";
import { reset, seed } from "drizzle-seed";
import { productImageTable, productTable, categoryTable } from "@/db/schema/product.schema";
import { drizzle } from "drizzle-orm/libsql";


const main = async () => {
  try {
    const db = drizzle(process.env.DB_URL!, {
      casing: "snake_case",
    })
    await reset(db, { productTable, productImageTable, categoryTable })
    await seed(db, { productTable, productImageTable, categoryTable }).refine((f) => ({
      productTable: {
        count: 10,
        columns: {
          name: f.string(),
          slug: f.string({ isUnique: true }),
          description: f.string(),
          priceBeforeTax: f.int({
            minValue: 1000,
            maxValue: 10000,
          }),
          taxRatePercentage: f.default({
            defaultValue: 10
          }),
          rating: f.number({
            minValue: 1,
            maxValue: 5,
          }),
          numReviews: f.int({
            minValue: 2,
            maxValue: 10,
          }),
          stock: f.int({
            minValue: 2,
            maxValue: 10,
          }),
        },
      },
      productImageTable: {
        count: 10,
        columns: {
          url: f.valuesFromArray({
            values: [
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p1-1.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p1-2.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p2-1.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p2-2.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p3-1.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p3-2.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p4-1.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p4-2.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p5-1.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p5-2.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p6-1.jpg",
              process.env.NEXT_PUBLIC_BUCKET_URL + "/images/sample-products/p6-2.jpg",
            ],
          }),
          image_name: f.string(),
        }
      },
      categoryTable: {
        count: 5,
        columns: {
          name: f.string(),
          slug: f.string({
            isUnique: true
          }),
          description: f.string(),
        }
      }
    }));
  } catch (e) {
    console.log("caught an error: ", e);
    console.log("--------------------done incorrectly--------------------");
    return
  }
  console.log("--------------------done--------------------");
};


main();
