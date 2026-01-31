import { arrayContains, eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "vitest";
import {
	createTestBrand,
	createTestCategory,
	createTestProduct,
	createTestProductImage,
} from "@/.testutils/factories/factories";
import { testDB } from "@/.testutils/test_db_client";
import {
	brandTable,
	categoryTable,
	productImageTable,
	productTable,
} from "@/db/schema/product.schema";
import { Product, productDomain } from "@/domain/product/product.domain";
import { createCategoryRepository } from "../category/category.repository";
import { createProductRepository } from "./product.repository";

describe("product repository", () => {
	beforeAll(async () => {
		await migrate(testDB, {
			migrationsFolder: `db/migrations`,
		});
	});
	beforeEach(async () => {
		await testDB.delete(productImageTable);
		await testDB.delete(productTable);
		await testDB.delete(categoryTable);
		await testDB.delete(brandTable);
	});
	describe("create", () => {
		test("正常に製品情報が登録される", async () => {
			const before = new Date();
			const productRepository = createProductRepository(testDB);

			const productImage1 = createTestProductImage();
			const productImage2 = createTestProductImage();
			const product: Product = createTestProduct({
				productImages: [productImage1, productImage2],
			});

			const res = await productRepository.create(product);
			console.log(res);
			expect(res.isOk()).toBe(true);

			const products = await testDB.select().from(productTable);

			const productImages = await testDB.select().from(productImageTable);

			const after = new Date();

			expect(products).toHaveLength(1);
			expect(products[0].brandId).toBe(product.brandId);
			expect(products[0].categoryId).toBe(product.categoryId);
			expect(products[0].name).toBe(product.name);
			expect(products[0].description).toBe(product.description);
			expect(products[0].priceBeforeTax).toBe(product.priceBeforeTax);
			expect(products[0].taxRate).toBe(product.taxRate);
			expect(products[0].numReviews).toBe(product.numReviews);
			expect(products[0].rating).toBe(product.rating);
			expect(products[0].stock).toBe(product.stock);
			expect(products[0].isFeatured).toBe(product.isFeatured);
			expect(products[0].createdAt).greaterThanOrEqual(before);
			expect(products[0].createdAt).lessThanOrEqual(after);
			expect(products[0].createdAt).greaterThanOrEqual(before);
			expect(products[0].createdAt).lessThanOrEqual(after);

			expect(productImages).toHaveLength(product.productImages.length);
			expect(productImages).toEqual(
				expect.arrayContaining([
					expect.objectContaining(productImage1),
					expect.objectContaining(productImage2),
				]),
			);
		});
	});

	describe("update", () => {
		const setup = async () => {
			const productRepo = createProductRepository(testDB);
			const images = [createTestProductImage(), createTestProductImage()];
			const product = createTestProduct({
				productImages: images,
			});

			await productRepo.create(product);

			return {
				productRepo,
				product,
				images,
			};
		};
		test("正常に製品がupdateされる", async () => {
			const { product, productRepo, images } = await setup();
			//  FIXME: imageを変更するdomain関数を導入
			images[0].imageName = "updatedImage";
			images[0].displayOrd = 100;
			images[0].url = "updated url";
			images[0].updatedAt = new Date();
			const updatedProduct: Product = {
				...product,
				name: "updated name",
				description: "updated description",
				categoryId: null,
				brandId: null,
				priceBeforeTax: 2000,
				priceAfterTax: 2200,
				taxRate: 10,
				numReviews: 2,
				rating: 3,
				stock: 10,
				productImages: images,
				isFeatured: true,
				updatedAt: new Date(),
			};

			const res = await productRepo.update(updatedProduct);
			console.log(res);
			expect(res.isOk()).toBe(true);

			const products = await testDB
				.select()
				.from(productTable)
				.where(eq(productTable.id, product.id));
			expect(products).toHaveLength(1);
			expect(products[0].name).toBe(updatedProduct.name);
			expect(products[0].description).toBe(updatedProduct.description);
			expect(products[0].priceBeforeTax).toBe(updatedProduct.priceBeforeTax);
			expect(products[0].taxRate).toBe(updatedProduct.taxRate);
			expect(products[0].numReviews).toBe(updatedProduct.numReviews);
			expect(products[0].rating).toBe(updatedProduct.rating);
			expect(products[0].stock).toBe(updatedProduct.stock);
			expect(products[0].isFeatured).toBe(updatedProduct.isFeatured);

			const udpatedImages = await testDB
				.select()
				.from(productImageTable)
				.where(eq(productImageTable.productId, product.id));
			expect(udpatedImages).toHaveLength(images.length);
			expect(udpatedImages[0].imageName).toBe(images[0].imageName);
			expect(udpatedImages[0].url).toBe(images[0].url);
			expect(udpatedImages[0].displayOrd).toBe(images[0].displayOrd);
			expect(udpatedImages[0].updatedAt).greaterThanOrEqual(product.updatedAt);
		});

		test("商品画像が追加される", async () => {
			const { product, productRepo } = await setup();

			
		});

		test("商品画像が削除される", async () => {
			const { product, productRepo } = await setup();
		});
	});

	afterAll(async () => {
		await testDB.$client.end();
	});
});
