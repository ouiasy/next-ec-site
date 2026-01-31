import { ulid } from "ulid";
import {
	CreateOrderInput,
	Order,
	OrderAddress,
} from "@/domain/order/order.types";

export const orderDomain = {
	create: (input: CreateOrderInput): Order => {
		const now = new Date();

		const orderItems = input.items.map((item) => ({
			...item,
			id: ulid(),
		}));

		const itemsSubtotal = orderItems.reduce(
			(sum, item) => sum + item.priceBeforeTax * item.quantity,
			0,
		);

		// todo: 税金計算は各々の商品ごとに算出する
		const taxTotal = Math.floor(
			orderItems.reduce(
				(sum, item) => sum + item.priceBeforeTax * item.quantity * item.taxRate,
				0,
			) / 100,
		);

		const shippingFee = calculateShippingFee(itemsSubtotal + taxTotal);

		const grandTotal = itemsSubtotal + taxTotal + shippingFee;

		return {
			id: ulid(),
			name: input.userName,
			email: input.email,
			userId: input.userId,
			items: orderItems,
			itemsSubtotal,
			taxTotal,
			shippingFee,
			grandTotal,
			orderStatus: "pending",
			shippingAddress: null,
			billingAddress: null,
			createdAt: now,
			updatedAt: now,
		};
	},

	insertShippingAddr: (order: Order, addr: OrderAddress): Order => {
		return {
			...order,
			shippingAddress: addr,
		};
	},

	insertBillingAddr: (order: Order, addr: OrderAddress): Order => {
		return {
			...order,
			billingAddress: addr,
		};
	},
};

const calculateShippingFee = (priceAfterTax: number): number => {
	if (priceAfterTax > 5_000) {
		return 0;
	}
	return 500;
};
