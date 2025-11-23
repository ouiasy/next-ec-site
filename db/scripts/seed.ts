import 'dotenv/config';
import {createClient} from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import {seed} from "drizzle-seed";
import {product} from "@/db/schema/product";

const main = async () => {
    try {
        await seed(db, {product}).refine((f) => ({
            product: {
                count: 10,
                columns: {
                    images: f.valuesFromArray({
                        values: [
                            '["/images/sample-products/p1-1.jpg","/images/sample-products/p1-2.jpg"]',
                            '["/images/sample-products/p2-1.jpg","/images/sample-products/p2-2.jpg"]',
                            '["/images/sample-products/p3-1.jpg","/images/sample-products/p3-2.jpg"]',
                            '["/images/sample-products/p4-1.jpg","/images/sample-products/p4-2.jpg"]',
                            '["/images/sample-products/p5-1.jpg","/images/sample-products/p5-2.jpg"]',
                            '["/images/sample-products/p6-1.jpg","/images/sample-products/p6-2.jpg"]'
                        ],
                    }),
                    price: f.int({
                        minValue: 1000,
                        maxValue: 10000,
                    }),
                    rating: f.int({
                        minValue: 0,
                        maxValue: 5
                    }),
                    numReviews: f.int({
                        minValue: 0,
                        maxValue: 100,
                    }),
                    stock: f.int({
                        minValue: 0
                    }),
                }
            }
        }))
    } catch (e) {
        console.log("caught an error: ", e);
    }
    console.log("done")
}



const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
})
const db = drizzle({
    client
})

main();
