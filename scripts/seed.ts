import { config } from "@dotenvx/dotenvx";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { ulid } from "ulid";
import {
	brandTable,
	categoryTable,
	productImageTable,
	productTable,
} from "@/db/schema/product.schema";

config();

const main = async () => {
	try {
		const db = drizzle(process.env.DB_URL!, {
			casing: "snake_case",
		});
		console.log("connecting to...: ", process.env.DB_URL);
		await reset(db, {
			productTable,
			productImageTable,
			categoryTable,
			brandTable,
		});
		await seed(db, {
			productTable,
			productImageTable,
			categoryTable,
			brandTable,
		}).refine((f) => ({
			productTable: {
				count: 10,
				columns: {
					id: f.valuesFromArray({
						values: Array.from({ length: 10 }, () => ulid()),
						isUnique: true,
					}),
					name: f.string(),
					description: f.string(),
					priceBeforeTax: f.int({
						minValue: 1000,
						maxValue: 10000,
					}),
					taxRate: f.default({
						defaultValue: 10,
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
					id: f.valuesFromArray({
						values: Array.from({ length: 10 }, () => ulid()),
						isUnique: true,
					}),
					url: f.valuesFromArray({
						values: [
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p1-1.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p1-2.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p2-1.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p2-2.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p3-1.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p3-2.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p4-1.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p4-2.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p5-1.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p5-2.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p6-1.jpg",
							process.env.NEXT_PUBLIC_BUCKET_URL +
								"/images/sample-products/p6-2.jpg",
						],
					}),
					image_name: f.string(),
				},
			},
			categoryTable: {
				count: 5,
				columns: {
					id: f.valuesFromArray({
						values: Array.from({ length: 10 }, () => ulid()),
						isUnique: true,
					}),
					name: f.string(),
					description: f.string(),
				},
			},
			brandTable: {
				count: 5,
				columns: {
					id: f.valuesFromArray({
						values: Array.from({ length: 10 }, () => ulid()),
						isUnique: true,
					}),
					name: f.string(),
					description: f.string(),
				},
			},
		}));
	} catch (e) {
		console.log("caught an error: ", e);
		console.log("--------------------done incorrectly--------------------");
		return;
	}
	console.log("--------------------done--------------------");
	return;
};

main();
