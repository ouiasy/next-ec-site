import { ProductImage } from "@/domain/product/product.domain";
import { ULID } from "ulid";

export type Order = {
	readonly id: ULID;
	readonly userId: ULID; // todo
	readonly customerName: string;
	readonly email: string;

	readonly itemsSubtotal: number;

	readonly couponId: string | null

	readonly shippingFee: number;
	readonly shippingDiscount: number;

	readonly discount: number;

	readonly taxTotal: number;
	readonly grandTotal: number;

	readonly orderStatus: OrderStatus;
	readonly items: OrderItems[];
	readonly shippingAddress: OrderAddress;
	readonly billingAddress: OrderAddress;
	readonly createdAt: Date;
	readonly updatedAt: Date;
};

export type OrderStatus = "pending" | "paid" | "completed" | "cancelled";

export type OrderItems = {
	readonly id: ULID;
	readonly productId: ULID;
	readonly name: string;
	readonly priceBeforeTax: number;
	readonly taxRate: number;
	readonly description: string;
	readonly productImages: ProductImage[]; 
	readonly quantity: number;
	readonly createdAt: Date;
};

export type OrderAddress = {
	readonly name: string;
	readonly postalCode: string;
	readonly prefecture: string;
	readonly city: string;
	readonly street: string;
	readonly building: string | null;
};


