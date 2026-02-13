import "server-only";
import { eq, inArray, sql, count } from "drizzle-orm";
import { err, ok, Result } from "neverthrow";
import { ULID } from "ulid";
import { DB } from "@/db";
import { productImageTable, productTable } from "@/db/schema/product.schema";
import { Product, ProductImage } from "@/domain/product/product.domain";
import { applySortOption, calculateLimit, calculateOffset, PagenatedProducts, PaginationProps, ProductRepository, SortOption } from "@/domain/product/product.domain.repository";
import { RepositoryError } from "@/domain/repository.error";
import { fromRawProduct, fromRawProductComposite, fromRawProductImage } from "./product.repository.utils";


export const createProductRepository = (db: DB): ProductRepository => ({
	getProductByID: async (productId: string): Promise<Result<Product | null, RepositoryError>> => {
		try {
			const rawProduct = await db.query.productTable.findFirst({
				with: {
					images: true
				},
				where: {
					id: productId,
				}
			})
			if (rawProduct === undefined) {
				return ok(null)
			}

			const product = fromRawProductComposite(rawProduct);
			return ok(product)
		} catch (e) {
			return err(new RepositoryError("商品情報の取得に失敗", { cause: e }));
		}
	},

	getByIDs: async (
		productIDs: string[],
		options?: { forUpdate?: boolean },
	): Promise<Result<Product[], RepositoryError>> => {
		if (productIDs.length === 0) return ok([]);

		const rawProducts = options?.forUpdate
			? await db
				.select()
				.from(productTable)
				.where(inArray(productTable.id, productIDs))
				.for("update")
			: await db
				.select()
				.from(productTable)
				.where(inArray(productTable.id, productIDs));

		if (rawProducts.length === 0) return ok([]);

		const productImageMap = new Map<ULID, ProductImage[]>(); // (productId, productImage[])

		const rawProductImages = await db
			.select()
			.from(productImageTable)
			.where(inArray(productImageTable.productId, productIDs))
			.orderBy(productImageTable.displayOrd);

		for (const i of rawProductImages) {
			const images = productImageMap.get(i.productId) ?? [];
			const image = fromRawProductImage(i);
			images.push(image);
			productImageMap.set(i.productId, images);
		}

		const products = [];
		for (const rawProduct of rawProducts){
			const productImages = productImageMap.get(rawProduct.id) ?? [];
			const product = fromRawProduct(rawProduct, productImages);
			products.push(product);
		}

		return ok(products);
	},

	getLatestProducts: async (
		sortOpt: SortOption,
		pageProps: PaginationProps
	): Promise<Result<PagenatedProducts, RepositoryError>> => {
		try {
			const offset = calculateOffset(pageProps);
			const limit = calculateLimit(pageProps);

			const [{ total }] = await db.select({ total: count() }).from(productTable)

			const rawProducts = await db.query.productTable.findMany({
				with: {
					images: true
				},
				orderBy: applySortOption(sortOpt),
				limit: limit,
				offset: offset,
			});

			const products = rawProducts.map(fromRawProductComposite);
			return ok({ products, total });
		} catch (e) {
			return err(new RepositoryError("最新商品の取得に失敗しました。", { cause: e }));
		}
	},

	getProductsByCategory: async (
		categoryId: ULID,
		sortOpt: SortOption,
		pageProps: PaginationProps
	): Promise<Result<PagenatedProducts, RepositoryError>> => {
		try {
			const offset = calculateOffset(pageProps);
			const limit = calculateLimit(pageProps);

			const [{ total }] = await db.select({ total: count() }).from(productTable)

			const rawProducts = await db.query.productTable.findMany({
				with: {
					images: true
				},
				orderBy: applySortOption(sortOpt),
				limit: limit,
				offset: offset,
				where: {
					categoryId: categoryId,
				}
			});
			const products = rawProducts.map(fromRawProductComposite);
			return ok({ products, total });
		} catch (e) {
			return err(new RepositoryError("カテゴリ別の商品の取得に失敗", { cause: e }));
		}
	},

	getProductsByBrand: async (
		brandId: string,
		sortOpt: SortOption,
		pageProps: PaginationProps
	): Promise<Result<PagenatedProducts, RepositoryError>> => {
		try {
			const offset = calculateOffset(pageProps);
			const limit = calculateLimit(pageProps);

			const [{ total }] = await db.select({ total: count() }).from(productTable)

			const rawProducts = await db.query.productTable.findMany({
				with: {
					images: true
				},
				orderBy: applySortOption(sortOpt),
				limit: limit,
				offset: offset,
				where: {
					brandId: brandId,
				}
			});
			const products = rawProducts.map(fromRawProductComposite);
			return ok({ products, total });
		} catch (e) {
			return err(new RepositoryError("ブランド別の商品の取得に失敗", { cause: e }));
		}
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
				new RepositoryError("商品情報の更新に失敗しました", { cause: e }),
			);
		}
	},
});

type InsertProductImage = typeof productImageTable.$inferInsert;
