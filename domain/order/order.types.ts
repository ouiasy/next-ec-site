import { ProductImage } from "@/domain/product/product.domain";

export type Order = {
	readonly id: string;
	readonly name: string;
	readonly email: string;
	readonly itemsSubtotal: number;
	readonly taxTotal: number;
	readonly shippingFee: number;
	readonly grandTotal: number;
	readonly couponId: string | null;
	readonly discount: number;
	readonly shippingDiscount: number;
	readonly orderStatus: OrderStatus;
	readonly items: OrderItems[];
	readonly shippingAddress: OrderAddress | null;
	readonly billingAddress: OrderAddress | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
};

type OrderStatus = "pending" | "paid" | "completed" | "cancelled";

type OrderItems = {
	readonly id: string;
	readonly productId: string;
	readonly name: string;
	readonly priceBeforeTax: number;
	readonly taxRate: number;
	readonly description: string;
	readonly productImages: ProductImage[];
	readonly quantity: number;
};

export type OrderAddress = {
	readonly name: string;
	readonly postalCode: string;
	readonly prefecture: string;
	readonly city: string;
	readonly street: string;
	readonly building: string | null;
};

export type CreateOrderInput = {
	readonly userName: string;
	readonly email: string;
	readonly items: Array<{
		productId: string;
		name: string;
		priceBeforeTax: number;
		taxRate: number;
		description: string;
		productImages: ProductImage[];
		quantity: number;
	}>;
};
