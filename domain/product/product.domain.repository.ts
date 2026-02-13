import { Result } from "neverthrow";
import { ULID } from "ulid";
import { Product } from "@/domain/product/product.domain";
import { RepositoryError } from "../repository.error";
import PagesManifestPlugin from "next/dist/build/webpack/plugins/pages-manifest-plugin";
import { asc, desc } from "drizzle-orm";
import { productTable } from "@/db/schema/product.schema";

export interface ProductRepository {
	getProductByID: (
		id: string,
	) => Promise<Result<Product | null, RepositoryError>>;
	/**
	 * 複数のidから該当の商品を取得する。optionのforupdateをtrueにすることで,
	 * select文がfor updateになり、order時の在庫確認に使える。
	 * @param ids 
	 * @param options 
	 * @returns 
	 */
	getByIDs: (
		ids: string[],
		options?: { forUpdate?: boolean },
	) => Promise<Result<Product[], RepositoryError>>;
	getLatestProducts: (
		sortOpt: SortOption,
		pageProps: PaginationProps,
	) => Promise<Result<PagenatedProducts, RepositoryError>>;
	getProductsByCategory: (
		categoryId: ULID,
		sortOpt: SortOption,
		pageProps: PaginationProps
	) => Promise<Result<PagenatedProducts, RepositoryError>>;
	getProductsByBrand: (
		brandId: ULID,
		sortOpt: SortOption,
		pageProps: PaginationProps
	) => Promise<Result<PagenatedProducts, RepositoryError>>;
	create: (product: Product) => Promise<Result<void, RepositoryError>>;
	update: (product: Product) => Promise<Result<void, RepositoryError>>;
}


export type SortOption = "newest" | "oldest" | "low price" | "high price";

export const applySortOption = (sortOpt: SortOption) => {
	switch (sortOpt) {
		case "newest":
			return {
				createdAt: "desc",
			} as const;
		case "oldest":
			return {
				createdAt: "asc"
			} as const;
		case "low price":
			return {
				priceBeforeTax: "asc"
			} as const;
		case "high price":
			return {
				priceBeforeTax: "desc"
			} as const;
	}
}

// ペジネーション用のパラメータ
export type PaginationProps = {
	readonly index: number; // 1-indexed
	readonly pageSize: number;
}
// sqlのoffsetにそのまま使う
export const calculateOffset = (pageProps: PaginationProps) => {
	return (pageProps.index - 1) * pageProps.pageSize
}

export const calculateLimit = (pageProps: PaginationProps) => {
	return pageProps.pageSize
}

export type PagenatedProducts = {
	products: Product[],
	total: number;
}