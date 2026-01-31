import { desc, eq, inArray } from "drizzle-orm";
import { ULID } from "ulid";
import { DB } from "@/db";
import { productImageTable, productTable } from "@/db/schema/product.schema";
import { Product, ProductImage } from "@/domain/product/product.domain";
import { ProductRepository } from "@/domain/product/product.domain.repository";

export const createProductRepository = (db: DB): ProductRepository => ({
	getProductByID: async (productId: string): Promise<Product | null> => {
		const [products, productImages] = await Promise.all([
			db
				.select()
				.from(productTable)
				.where(eq(productTable.id, productId))
				.limit(1),

			db
				.select()
				.from(productImageTable)
				.where(eq(productImageTable.productId, productId))
				.orderBy(productImageTable.displayOrder),
		]);

		if (products.length === 0) return null;

		const product = products[0];
		const totalPrice = ((product.taxRate + 100) * product.priceBeforeTax) / 100;

		return {
			...product,
			priceAfterTax: totalPrice,
			productImages: productImages,
		};
	},

	getByIDs: async (productIDs: string[]): Promise<Product[]> => {
		const products = await db
			.select()
			.from(productTable)
			.where(inArray(productTable.id, productIDs));

		if (products.length === 0) return [];

		const productImageMap = new Map<ULID, ProductImage[]>(); // (productId, productImage[])

		const productImages = await db
			.select()
			.from(productImageTable)
			.where(inArray(productImageTable.productId, productIDs))
			.orderBy(productImageTable.displayOrder);

		productImages.map((i) => {
			const images = productImageMap.get(i.productId) ?? [];
			images.push(i);
			productImageMap.set(i.productId, images);
		});

		return products.map((p) => ({
			...p,
			priceAfterTax: (p.priceBeforeTax * (100 + p.taxRate)) / 100,
			productImages: productImageMap.get(p.id) ?? [],
		}));
	},

	getLatestProducts: async (limit: number = 5): Promise<Product[]> => {
		const products = await db
			.select()
			.from(productTable)
			.orderBy(desc(productTable.updatedAt))
			.limit(limit);

		if (products.length === 0) return [];

		const productImages = await db
			.select()
			.from(productImageTable)
			.where(
				inArray(
					productImageTable.productId,
					products.map((p) => p.id),
				),
			)
			.orderBy(productImageTable.displayOrder);

		const imageMap = new Map<ULID, ProductImage[]>(); // (productID, ProductImage)
		for (const img of productImages) {
			const images = imageMap.get(img.productId) || [];
			images.push({
				url: img.url,
				imageName: img.imageName,
				displayOrd: img.displayOrder,
			});
			imageMap.set(img.productId, images);
		}

		return products.map((p) => ({
			...p,
			priceAfterTax: (p.priceBeforeTax * (p.taxRate + 100)) / 100,
			productImages: imageMap.get(p.id) ?? [],
		}));
	},

	getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
		const products = await db
			.select()
			.from(productTable)
			.where(eq(categoryId, productTable.categoryId));
		const productImages = await db
			.select()
			.from(productImageTable)
			.where(
				inArray(
					productImageTable.productId,
					products.map((p) => p.id),
				),
			);

		const productImageMap = new Map<ULID, ProductImage[]>(); // (productID, ProductImage[])
		for (const img of productImages) {
			const images = productImageMap.get(img.productId) ?? [];
			images.push(img);
			productImageMap.set(img.productId, images);
		}

		return products.map((p) => ({
			...p,
			productImages: productImageMap.get(p.id) ?? [],
		}));
	},

	getProductsByBrand: async (brandId: string): Promise<Product[]> => {
		const products = await db
			.select()
			.from(productTable)
			.where(eq(productTable.brandId, brandId));
		if (products.length === 0) return [];

		const productImages = await db
			.select()
			.from(productImageTable)
			.where(
				inArray(
					productImageTable.productId,
					products.map((p) => p.id),
				),
			);

		const productImageMap = new Map<ULID, ProductImage[]>(); // (productID, ProductImage[])
		for (const img of productImages) {
			const images = productImageMap.get(img.productId) ?? [];
			images.push(img);
			productImageMap.set(img.productId, images);
		}

		return products.map((p) => ({
			...p,
			productImages: productImageMap.get(p.id) ?? [],
		}));
	},

	save: async (product: Product): Promise<void> => {
		console.log("not implemented");
	},
});
