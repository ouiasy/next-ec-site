import { ProductImage } from "@/domain/product/product.domain";
import { Prefecture } from "@/types/prefecture.type";
import { ULID } from "ulid";

export type Order = {
	readonly id: ULID;
	readonly userId: ULID | null; // ユーザーが退会する可能性があるのでnull
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
	readonly quantity: number;
	readonly createdAt: Date;
};

export type OrderAddress = {
	readonly id: ULID;
	readonly name: string;
	readonly postalCode: string;
	readonly prefecture: Prefecture;
	readonly city: string;
	readonly street: string;
	readonly building: string | null;
	readonly createdAt: Date;
};


