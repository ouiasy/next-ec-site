import "dotenv/config";
import {seed} from "drizzle-seed";
import {products} from "@/db/schema/product";
import {db} from "@/db";

const main = async () => {
  try {
    await db.delete(products);
    await seed(db, {products}).refine((f) => ({
      products: {
        count: 10,
        columns: {
          name: f.string(),
          slug: f.string({isUnique: true}),
          category: f.string(),
          description: f.string({arraySize: 50}),
          images: f.valuesFromArray({
            values: [
              '["/images/sample-products/p1-1.jpg","/images/sample-products/p1-2.jpg"]',
              '["/images/sample-products/p2-1.jpg","/images/sample-products/p2-2.jpg"]',
              '["/images/sample-products/p3-1.jpg","/images/sample-products/p3-2.jpg"]',
              '["/images/sample-products/p4-1.jpg","/images/sample-products/p4-2.jpg"]',
              '["/images/sample-products/p5-1.jpg","/images/sample-products/p5-2.jpg"]',
              '["/images/sample-products/p6-1.jpg","/images/sample-products/p6-2.jpg"]',
            ],
          }),
          price: f.int({
            minValue: 1000,
            maxValue: 10000,
          }),
          rating: f.int({
            minValue: 0,
            maxValue: 5,
          }),
          numReviews: f.int({
            minValue: 0,
            maxValue: 10,
          }),
          stock: f.int({
            minValue: 0,
            maxValue: 3,
          }),
        },
      },
    }));
  } catch (e) {
    console.log("caught an error: ", e);
  }
  console.log("done");
};


main();
