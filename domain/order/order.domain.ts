import { isValid, ULID, ulid } from "ulid";
import {
	Order,
	OrderAddress,
	OrderItems,
} from "@/domain/order/order.types";
import { ProductImage } from "../product/product.domain";
import { Result, err, ok } from "neverthrow";
import { InvalidIdError, InvalidValueError, OrderDomainError } from "./order.domain.errors";
import { OrderStatus } from "@/domain/order/order.types";
import { RepositoryError } from "../repository.error";

export type CreateOrderInput = {
	readonly userId: ULID;
	readonly customerName: string;
	readonly email: string;

	readonly couponId: string | null;

	readonly shippingFee: number;
	readonly shippingDiscount: number;

	readonly discount: number;

	readonly items: Array<{
		readonly productId: ULID;
		readonly name: string;
		readonly priceBeforeTax: number;
		readonly taxRate: number;
		readonly description: string;
		readonly productImages: ProductImage[];
		readonly quantity: number;
	}>;
	readonly shippingAddress: OrderAddress;
	readonly billingAddress: OrderAddress;
};

export const orderDomain = {
	create: (input: CreateOrderInput): Result<Order, OrderDomainError> => {
		if (!isValid(input.userId)) {
			return err(new InvalidIdError("無効なユーザーIDです"));
		}
		const refinedCustomerName = input.customerName.trim();
		if (refinedCustomerName.length === 0) {
			return err(new InvalidValueError("顧客名は必須です"));
		}
		const refinedEmail = input.email.trim();
		if (refinedEmail.length === 0) {
			return err(new InvalidValueError("メールアドレスは必須です"));
		}

		const orderItems: OrderItems[] = [];
		for (const item of input.items) {
			if (!isValid(item.productId)) {
				return err(new InvalidIdError("無効な商品IDです"));
			}
			const trimmedName = item.name.trim()
			if (trimmedName.length < 0) {
				return err(new InvalidValueError("無効な商品名です"));
			}
			if (item.priceBeforeTax < 0) {
				return err(new InvalidValueError("商品金額は0円より大きくしてください"))
			}
			if (![0, 8, 10].includes(item.taxRate)) {
				return err(new InvalidValueError("税率は0, 8, 10のうちどれかにしてください"))
			}
			const trimmedDescription = item.description.trim();
			if (item.quantity <= 0) {
				return err(new InvalidValueError("数量は1以上でなければなりません"));
			}
			orderItems.push({
				id: ulid(),
				productId: item.productId,
				name: trimmedName,
				priceBeforeTax: item.priceBeforeTax,
				taxRate: item.taxRate,
				description: trimmedDescription,
				productImages: item.productImages,
				quantity: item.quantity,
				createdAt: new Date(),
			});
		}

		const itemsSubtotal = orderItems.reduce(
			(sum, item) => sum + item.priceBeforeTax * item.quantity,
			0,
		);
		if (itemsSubtotal < 0) {
			return err(new InvalidValueError("不正な商品合計金額です"));
		}

		if (input.couponId !== null && input.couponId.trim().length < 0) {
			return err(new InvalidValueError("無効なクーポンコードです"));
		}

		if (input.shippingFee < 0 || input.shippingDiscount < 0) {
			return err(new InvalidValueError("送料, 送料ディスカウントは0円以上の値にしてください"))
		}
		const netShippingFee = input.shippingFee - input.shippingDiscount;
		if (netShippingFee < 0) {
			return err(new InvalidValueError("送料は0円以上にしてください"));
		}

		// 税抜き商品価格 - ディスカウント + 正味の送料から算出
		// 商品からtaxを計算
		let taxTotal = orderItems.reduce(
			(sum, item) => sum + Math.ceil(item.priceBeforeTax * item.quantity * item.taxRate / 100),
			0
		)
		// ディスカウント分の税金計算
		// TODO: 軽減税率(8%)導入時は、値引きの按分計算が必要。現在は一律10%として計算。
		if (input.discount > 0) {
			taxTotal -= Math.ceil(input.discount / 10);
		}
		// 送料分の消費税追加
		taxTotal += Math.ceil(netShippingFee / 10);

		const grandTotal = itemsSubtotal + taxTotal + netShippingFee;
		const now = new Date();

		return ok({
			id: ulid(),
			userId: input.userId,
			customerName: input.customerName,
			email: input.email,
			
			itemsSubtotal: itemsSubtotal,

			couponId: input.couponId,

			shippingFee: input.shippingFee,
			shippingDiscount: input.shippingDiscount,

			discount: input.discount,

			taxTotal: taxTotal,
			grandTotal: grandTotal,

			orderStatus: "pending",
			items: orderItems,
			shippingAddress: input.shippingAddress,
			billingAddress: input.billingAddress,
			createdAt: now,
			updatedAt: now,
		});
	},

	changeOrderStatus: (original: Order, status: OrderStatus): Order => {
		return {
			...original,
			orderStatus: status,
		}
	}

};

export interface OrderRepository {
	getOrderById: (orderId: ULID) => Promise<Result<Order | null, RepositoryError>>;
	getOrdersByUserId: (userId: ULID) => Promise<Result<Order[], RepositoryError>>;
	save: (order: Order) => Promise<Result<Order, RepositoryError>>;
}