export type DetailedCartItem = {
	readonly productId: string;

	readonly productImages: ProductImage[];

	readonly name: string;
	readonly quantity: number;

	readonly taxRate: number;
	readonly priceBeforeTax: number;
	readonly priceAfterTax: number;

	readonly rating: number | null;
	readonly numReviews: number;

	readonly isFeatured: boolean;
};

type ProductImage = {
	readonly url: string;
	readonly imageAlt: string | null;
	readonly displayOrd: number;
};

export type CartDetailedResult = {
	readonly items: DetailedCartItem[];
	readonly subTotal: number;
	readonly taxTotal: number;
	readonly grandTotal: number;
};
