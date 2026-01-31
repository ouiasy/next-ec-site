import { err, ok, Result } from "neverthrow";
import { isValid, ULID, ulid } from "ulid";
import {
	EmptyValueError,
	InvalidPriceError,
	InvalidStockError,
	InvalidTaxRateError,
	ProductDomainError,
} from "./product.domain.errors";

export type Product = {
	readonly id: ULID;
	readonly name: string;
	readonly description: string;
	readonly categoryId: ULID | null;
	readonly brandId: ULID | null;

	readonly priceBeforeTax: number;
	readonly taxRate: number;
	readonly priceAfterTax: number;

	readonly numReviews: number;
	readonly rating: number | null;
	readonly stock: number;
	readonly productImages: ProductImage[];
	readonly isFeatured: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
};

export type ProductImage = {
	id: ULID;
	url: string;
	imageName: string | null;
	displayOrd: number;
	createdAt: Date;
	updatedAt: Date;
};

export type CreateProductInput = Omit<
	Product,
	"id" | "priceAfterTax" | "createdAt" | "updatedAt" | "numReviews"
>;

type CreateImageInput = Omit<ProductImage, "id" | "createdAt" | "updatedAt">;

export type UpdateProductInput = Partial<
	Omit<
		Product,
		"id" | "priceAfterTax" | "createdAt" | "updatedAt" | "rating" | "numReviews"
	>
>;

export const productDomain = {
	/**
	 * 新たに商品を作成する
	 * @param input
	 * @returns
	 */
	create: (input: CreateProductInput): Result<Product, ProductDomainError> => {
		const safeName = input.name.trim();
		if (safeName.length === 0) {
			return err(new EmptyValueError("商品名を入力してください"));
		}

		const safeDescription = input.description.trim();
		if (safeDescription.length === 0) {
			return err(new EmptyValueError("商品説明を入力してください"));
		}

		if (input.priceBeforeTax < 0) {
			return err(new InvalidPriceError("商品金額エラーが生じました"));
		}

		const VALID_TAX_RATES = [0, 8, 10];
		if (!VALID_TAX_RATES.includes(input.taxRate)) {
			return err(new InvalidTaxRateError("税率エラーが生じました"));
		}

		if (input.stock < 0) {
			return err(new InvalidStockError("在庫数エラーが生じました"));
		}

		const priceAfterTax = Math.ceil(
			input.priceBeforeTax * (1 + input.taxRate / 100),
		);

		const nowTime = new Date();
		return ok({
			id: ulid(),
			name: safeName,
			categoryId: input.categoryId,
			description: safeDescription,
			productImages: input.productImages,
			priceBeforeTax: input.priceBeforeTax,
			priceAfterTax: priceAfterTax,
			taxRate: input.taxRate,
			brandId: input.brandId,
			numReviews: 0,
			rating: null,
			stock: input.stock,
			isFeatured: input.isFeatured,
			createdAt: nowTime,
			updatedAt: nowTime,
		});
	},

	/**
	 * 商品情報をupdateする
	 * @param product
	 * @param override
	 */
	update: (product: Product, updates: UpdateProductInput): Result<Product, ProductDomainError> => {
		const newPriceBeforeTax = updates.priceBeforeTax ?? product.priceBeforeTax;
		const newTaxRate = updates.taxRate ?? product.taxRate;
		const newPriceAfterTax = Math.ceil(newPriceBeforeTax * (1 + newTaxRate / 100));
		const newStock = updates.stock ?? product.stock;

		const newName = updates.name ?? product.name;

		if (newName.length === 0) {
			return err(new EmptyProductNameError("商品名を入力してください"));
		}

		if (newPriceBeforeTax < 0) {
			return err(new InvalidPriceError("商品金額エラーが生じました"));
		}

		const VALID_TAX_RATES = [0, 8, 10];
		if (!VALID_TAX_RATES.includes(newTaxRate)) {
			return err(new InvalidTaxRateError("税率エラーが生じました"));
		}

		if (newStock < 0) {
			return err(new InvalidStockError("在庫数エラーが生じました"));
		}

		return ok({
			...product,
			name: newName,
			description: updates.description ?? product.description,
			brandId: updates.brandId ?? product.brandId,
			categoryId: updates.categoryId ?? product.categoryId,
			priceBeforeTax: newPriceBeforeTax,
			taxRate: newTaxRate,
			priceAfterTax: newPriceAfterTax,
			stock: updates.stock ?? product.stock,
			productImages: updates.productImages ?? product.productImages,
			updatedAt: new Date(),
			isFeatured: updates.isFeatured ?? product.isFeatured,
		})
	},

	/**
	 * 商品画像エンティティを作成する
	 * @param input
	 * @returns
	 */
	createImage: (
		input: CreateImageInput,
	): Result<ProductImage, ProductDomainError> => {
		const now = new Date();
		return ok({
			id: ulid(),
			url: input.url,
			imageName: input.imageName,
			displayOrd: input.displayOrd,
			createdAt: now,
			updatedAt: now,
		});
	},

	changeStockBy: (
		product: Product,
		by: number,
	): Result<Product, ProductDomainError> => {
		if (product.stock + by < 0) {
			return err(new InvalidStockError("在庫が不足しています"));
		}
		return ok({
			...product,
			stock: product.stock + by,
		});
	},

	addNumReviews: (product: Product): Product => {
		return {
			...product,
			numReviews: product.numReviews + 1,
		};
	},

	changeIsFeatured: (product: Product, state: boolean): Product => {
		return {
			...product,
			isFeatured: state,
		};
	},
};
