import { desc, eq, inArray, sql } from "drizzle-orm";
import { err, ok, Result } from "neverthrow";
import { ULID } from "ulid";
import { DB } from "@/db";
import { productImageTable, productTable } from "@/db/schema/product.schema";
import { Product, ProductImage } from "@/domain/product/product.domain";
import { ProductRepository } from "@/domain/product/product.domain.repository";
import { RepositoryError } from "@/infrastructure/repository/repository.error";
import { SelectProductTable } from "@/types/dto/response/product.actions.response";

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

	getByIDs: async (
		productIDs: string[],
		options?: { forUpdate?: boolean },
	): Promise<Product[]> => {
		if (productIDs.length === 0) return [];

		const products = options?.forUpdate
			? await db
					.select()
					.from(productTable)
					.where(inArray(productTable.id, productIDs))
					.for("update")
			: await db
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
			images.push({
				displayOrd: i.displayOrder,
				imageName: i.imageName,
				url: i.url,
			});
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
			.where(eq(productTable.categoryId, categoryId));
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

	/**
	 * 新たにproductを登録する
	 * @param product
	 * @returns
	 */
	create: async (product: Product): Promise<Result<void, RepositoryError>> => {
		try {
			await db.transaction(async (tx) => {
				await tx.insert(productTable).values({
					id: product.id,
					name: product.name,
					description: product.description,
					categoryId: product.categoryId,
					brandId: product.brandId,
					priceBeforeTax: product.priceBeforeTax,
					taxRate: product.taxRate,
					rating: product.rating,
					numReviews: product.numReviews,
					stock: product.stock,
					isFeatured: product.isFeatured,
					createdAt: product.createdAt,
					updatedAt: product.updatedAt,
				});

				const images: InsertProductImage[] = product.productImages.map((p) => ({
					...p,
					productId: product.id,
				}));

				if (images.length > 0) {
					await tx.insert(productImageTable).values(images);
				}
			});
			return ok(undefined);
		} catch (e) {
			return err(
				new RepositoryError("商品新規作成に失敗しました", { cause: e }),
			);
		}
	},

	update: async (product: Product): Promise<Result<void, RepositoryError>> => {
		try {
			await db.transaction(async (tx) => {
				const originalImages: InsertProductImage[] = await tx
					.select()
					.from(productImageTable)
					.where(eq(productImageTable.productId, product.id));

				const originalImagesMap = new Map(originalImages.map((i) => [i.id, i]));

				const images: InsertProductImage[] = product.productImages.map((p) => ({
					...p,
					productId: product.id,
				}));

				const upsertImages = [];

				for (const i of images) {
					upsertImages.push(i);
					originalImagesMap.delete(i.id);
				}

				// イメージのupsert
				if (upsertImages.length > 0) {
					await tx
						.insert(productImageTable)
						.values(upsertImages)
						.onConflictDoUpdate({
							target: productImageTable.id,
							set: {
								imageName: sql`excluded.image_name`,
								url: sql`excluded.url`,
								displayOrd: sql`excluded.display_ord`,
								updatedAt: sql`excluded.updated_at`,
							}
						});
				}

				const deletedImages: ULID[] = Array.from(originalImagesMap.keys());
				// イメージの削除
				if (deletedImages.length > 0) {
					await tx
						.delete(productImageTable)
						.where(inArray(productImageTable.id, deletedImages));
				}

				const { productImages, priceAfterTax, ...updateProduct } = product;

				await tx
					.update(productTable)
					.set(updateProduct)
					.where(eq(productTable.id, product.id));
			});

			return ok(undefined);
		} catch (e) {
			return err(
				new RepositoryError("商品新規作成に失敗しました", { cause: e }),
			);
		}
	},
});

type InsertProductImage = typeof productImageTable.$inferInsert;
