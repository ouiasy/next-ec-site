import { ProductRepository } from "@/domain/product/product.domain.repository";
import { Brand, BrandRepository } from "@/domain/brand/brand.domain";
import {
	Category,
	CategoryRepository,
} from "@/domain/category/category.domain";
import { Product } from "@/domain/product/product.domain";

type ProductDetailResult = Omit<Product, "brandId" | "categoryId"> & {
	brand: Brand | null;
	category: Category | null;
};

export const createProductService = (
	productRepo: ProductRepository,
	brandRepo: BrandRepository,
	categoryRepo: CategoryRepository,
) => ({
	/**
	 * 与えられたproductIDを持つ商品の詳細情報をreturnする
	 * @param productId
	 */
	getProductDetail: async (productId: string): Promise<ProductDetailResult> => {
		const product = await productRepo.getProductByID(productId);
		if (product === null)
			throw new Error(`商品ID:${productId}が見つかりません`);

		const [brand, category] = await Promise.all([
			product.brandId ? brandRepo.getBrandById(product.brandId) : null,
			product.categoryId
				? categoryRepo.getCategoryById(product.categoryId)
				: null,
		]);

		const { brandId, categoryId, ...rest } = product;

		return {
			...rest,
			brand,
			category,
		};
	},

	/**
	 * 最新の商品をlimit個分returnする
	 * @param limit
	 */
	getLatestProducts: async (
		limit: number = 5,
	): Promise<ProductDetailResult[]> => {
		const latestProducts = await productRepo.getLatestProducts(limit);
		if (latestProducts.length === 0) return [];

		const categoryIDs = latestProducts
			.map((product) => product.categoryId) // todo : setで重複削除
			.filter((id) => id !== null);
		const categories = await categoryRepo.getCategoriesByIDs(categoryIDs);
		const categoryMap = new Map(categories.map((c) => [c.id, c]));

		const brandIDs = latestProducts
			.map((p) => p.brandId) // todo : setで重複削除
			.filter((id) => id !== null);
		const brands = await brandRepo.getBrandsByIDs(brandIDs);
		const brandMap = new Map(brands.map((b) => [b.id, b]));

		return latestProducts.map(({ brandId, categoryId, ...rest }) => ({
			...rest,
			brand: brandMap.get(brandId) ?? null,
			category: categoryMap.get(categoryId) ?? null,
		}));
	},
});
