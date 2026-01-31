import { Result } from "neverthrow";
import { ULID } from "ulid";
import { Product } from "@/domain/product/product.domain";
import { RepositoryError } from "../../infrastructure/repository/repository.error";

export interface ProductRepository {
	getProductByID: (
		id: string,
	) => Promise<Result<Product | null, RepositoryError>>;
	getByIDs: (
		ids: string[],
		options?: { forUpdate?: boolean },
	) => Promise<Result<Product[], RepositoryError>>;
	getLatestProducts: (
		limit: number,
	) => Promise<Result<Product[], RepositoryError>>;
	getProductsByCategory: (
		categoryId: ULID,
	) => Promise<Result<Product[], RepositoryError>>;
	getProductsByBrand: (
		brandId: ULID,
	) => Promise<Result<Product[], RepositoryError>>;
	create: (product: Product) => Promise<Result<void, RepositoryError>>;
	update: (product: Product) => Promise<Result<void, RepositoryError>>;
}
