import { ExperienceContextShippingPreference } from "@paypal/paypal-server-sdk";
import { ulid } from "ulid";
import { describe, expect, test, vi } from "vitest";
import {
	createTestProduct,
	createTestProductImage,
} from "@/.testutils/factories/factories";
import { ProductCard } from "@/components/shared/products/product-card";
import {
	CreateProductInput,
	Product,
	productDomain,
	UpdateProductInput,
} from "@/domain/product/product.domain";

describe("productDomain", () => {
	describe("create", () => {
		test("有効な入力で商品が作成されること(ついでにimage作成のテスト)", () => {
			const image = productDomain
				.createImage({
					url: "http://example.com",
					imageName: null,
					displayOrd: 0,
				})
				._unsafeUnwrap();

			const input: CreateProductInput = {
				name: "New Product",
				categoryId: ulid(),
				description: "description example",
				productImages: [image],
				priceBeforeTax: 2000,
				taxRate: 10,
				brandId: ulid(),
				rating: null,
				stock: 50,
				isFeatured: true,
			};

			const product = productDomain.create(input)._unsafeUnwrap();

			expect(product.id).toBeDefined();
			expect(product.name).toBe(input.name);
			expect(product.priceAfterTax).toBe(
				input.priceBeforeTax * (1 + input.taxRate / 100),
			);
			expect(product.numReviews).toBe(0);
			expect(product.createdAt).toBeInstanceOf(Date);
		});

		test("名前が空の場合はエラー", () => {
			const product = productDomain.create({
				name: " ",
				categoryId: ulid(),
				description: "description example",
				productImages: [],
				priceBeforeTax: 2000,
				taxRate: 10,
				brandId: ulid(),
				rating: null,
				stock: 50,
				isFeatured: true,
			});
			expect(product.isOk()).toBe(false);
		});

		test("商品説明が空の場合はエラー", () => {
			const product = productDomain.create({
				name: "name",
				categoryId: ulid(),
				description: " ",
				productImages: [],
				priceBeforeTax: 2000,
				taxRate: 10,
				brandId: ulid(),
				rating: null,
				stock: 50,
				isFeatured: true,
			});
			expect(product.isOk()).toBe(false);
		});

		test("価格が負の場合はエラー", () => {
			const product = productDomain.create({
				name: "name",
				categoryId: ulid(),
				description: "description example",
				productImages: [],
				priceBeforeTax: -2000,
				taxRate: 10,
				brandId: ulid(),
				rating: null,
				stock: 50,
				isFeatured: true,
			});
			expect(product.isOk()).toBe(false);
		});

		test("不正な税率の場合はエラー", () => {
			const product = productDomain.create({
				name: "name",
				categoryId: ulid(),
				description: "description example",
				productImages: [],
				priceBeforeTax: 2000,
				taxRate: 7,
				brandId: ulid(),
				rating: null,
				stock: 50,
				isFeatured: true,
			});
			expect(product.isOk()).toBe(false);
		});
	});

	describe("update", () => {
		test("正常に商品情報がupdateされる", () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date());

			const product = createTestProduct();
			const updatedImages = product.productImages;
			updatedImages.push(createTestProductImage());
			const updatedProduct: UpdateProductInput = {
				name: "updated Name",
				categoryId: ulid(),
				brandId: ulid(),
				description: "updated description",
				priceBeforeTax: product.priceBeforeTax * 2,
				isFeatured: !product.isFeatured,
				stock: product.stock + 1,
				taxRate: 0,
				productImages: updatedImages,
			};

			vi.advanceTimersByTime(1000);

			const res = productDomain.update(product, updatedProduct)._unsafeUnwrap();
			expect(res.id).toBe(product.id);
			expect(res.name).toBe(updatedProduct.name);
			expect(res.description).toBe(updatedProduct.description);
			expect(res.categoryId).toBe(updatedProduct.categoryId);
			expect(res.brandId).toBe(updatedProduct.brandId);
			expect(res.isFeatured).toBe(updatedProduct.isFeatured);
			expect(res.priceBeforeTax).toBe(updatedProduct.priceBeforeTax);
			expect(res.taxRate).toBe(updatedProduct.taxRate);
			expect(res.priceAfterTax).toBe(
				Math.ceil(res.priceBeforeTax * (1 + res.taxRate / 100)),
			);
			expect(res.stock).toBe(updatedProduct.stock);
			expect(res.productImages).toEqual(expect.arrayContaining(updatedImages));
			expect(res.updatedAt.getTime()).toBeGreaterThan(product.updatedAt.getTime());
		});

	});

	describe("changeStockBy", () => {
		test("在庫を増やす", () => {
			const product = createTestProduct({ stock: 10 });
			const updated = productDomain.changeStockBy(product, 3)._unsafeUnwrap();
			expect(updated.stock).toBe(13);
		});
		test("在庫を減らす", () => {
			const product = createTestProduct({ stock: 10 });
			const updated = productDomain.changeStockBy(product, -3)._unsafeUnwrap();
			expect(updated.stock).toBe(7);
		});

		test("在庫以上の数を減らそうとするとエラー", () => {
			const product = createTestProduct({ stock: 5 });
			const res = productDomain.changeStockBy(product, -6);
			expect(res.isErr()).toBe(true);
		});
	});

	describe("addNumReviews", () => {
		test("レビュー数が1増えること", () => {
			const product = createTestProduct({ numReviews: 5 });
			const updated = productDomain.addNumReviews(product);
			expect(updated.numReviews).toBe(6);
		});
	});

	describe("changeIsFeatured", () => {
		test("注目商品の状態を変更できること", () => {
			const product = createTestProduct({ isFeatured: false });
			const updated = productDomain.changeIsFeatured(product, true);
			expect(updated.isFeatured).toBe(true);
		});
	});
});
