import { expect, describe, test, vi } from "vitest";
import { ProductRepository } from "@/domain/product/product.domain.repository";
import {
	categoryDomain,
	CategoryRepository,
} from "@/domain/category/category.domain";
import { createProductService } from "@/service/product/product.service";
import { brandDomain, BrandRepository } from "@/domain/brand/brand.domain";
import { productDomain } from "@/domain/product/product.domain";

describe("product service", () => {
	const mockProductRepo: ProductRepository = {
		getByIDs: vi.fn(),
		getLatestProducts: vi.fn(),
		getProductByID: vi.fn(),
		getProductsByBrand: vi.fn(),
		getProductsByCategory: vi.fn(),
		save: vi.fn(),
	};

	const mockBrandRepo: BrandRepository = {
		getBrandById: vi.fn(),
		getBrandsByIDs: vi.fn(),
		save: vi.fn(),
	};

	const mockCategoryRepo: CategoryRepository = {
		getCategoryById: vi.fn(),
		getCategoriesByIDs: vi.fn(),
		save: vi.fn(),
	};

	describe("getProductDetail", () => {
		const productService = createProductService(
			mockProductRepo,
			mockBrandRepo,
			mockCategoryRepo,
		);

		test("各repositoryから正しく商品情報を取得する", async () => {
			const brand = brandDomain.create("Test Brand", "Description");
			const category = categoryDomain.create("Test Category", "Description");
			const product = productDomain.create({
				name: "Test Product",
				categoryId: category.id,
				brandId: brand.id,
				priceBeforeTax: 1000,
				taxRate: 10,
				description: "Description",
				stock: 10,
				rating: 3,
				productImages: [],
				isFeatured: false,
			});

			vi.mocked(mockProductRepo.getProductByID).mockResolvedValue(product);
			vi.mocked(mockBrandRepo.getBrandById).mockResolvedValue(brand);
			vi.mocked(mockCategoryRepo.getCategoryById).mockResolvedValue(category);

			const result = await productService.getProductDetail(product.id);

			expect(result.id).toBe(product.id);
			expect(result.brand).toEqual(brand);
			expect(result.category).toEqual(category);
			expect(mockProductRepo.getProductByID).toHaveBeenCalledWith(product.id);
			expect(mockBrandRepo.getBrandById).toHaveBeenCalledWith(brand.id);
			expect(mockCategoryRepo.getCategoryById).toHaveBeenCalledWith(
				category.id,
			);
		});

		test("存在しない商品IDを検索するとエラーが出る", async () => {
			vi.mocked(mockProductRepo.getProductByID).mockResolvedValue(null);

			expect(productService.getProductDetail("non-existent")).rejects.toThrow(
				"商品ID:non-existentが見つかりません",
			);
		});
	});

	describe("getLatestProducts", () => {
		const productService = createProductService(
			mockProductRepo,
			mockBrandRepo,
			mockCategoryRepo,
		);

		test("引数なしのgetLatestProductsで5つの最新商品が取得できる", async () => {
			const brand = brandDomain.create("Test Brand", "Description");
			const category = categoryDomain.create("Test Category", "Description");
			const products = Array.from({ length: 5 }).map((_, i) =>
				productDomain.create({
					name: `Product ${i}`,
					categoryId: category.id,
					brandId: brand.id,
					priceBeforeTax: 1000,
					taxRate: 10,
					description: "Description",
					stock: 10,
					rating: 3,
					productImages: [],
					isFeatured: false,
				}),
			);

			vi.mocked(mockProductRepo.getLatestProducts).mockResolvedValue(products);
			vi.mocked(mockBrandRepo.getBrandsByIDs).mockResolvedValue([brand]);
			vi.mocked(mockCategoryRepo.getCategoriesByIDs).mockResolvedValue([
				category,
			]);

			const result = await productService.getLatestProducts();

			expect(result).toHaveLength(5);
			expect(result[0].brand).toEqual(brand);
			expect(result[0].category).toEqual(category);
			expect(mockProductRepo.getLatestProducts).toHaveBeenCalledWith(5);
		});
	});
});
