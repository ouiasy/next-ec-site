import {
	CheckoutPaymentIntent,
	Client,
	Environment,
	ItemCategory,
	ItemRequest,
	OrdersController,
} from "@paypal/paypal-server-sdk";
import { Order } from "@/domain/order/order.types";

export const createPaypalGateway = () => {
	const client = new Client({
		clientCredentialsAuthCredentials: {
			oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
			oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
		},
		environment:
			process.env.PAYPAL_ENV! === "Production"
				? Environment.Production
				: Environment.Sandbox,
		timeout: 10000, // 10s
	});

	const ordersController = new OrdersController(client);

	return {
		createOrder: async (order: Order) => {
			const items: ItemRequest[] = order.items.map(
				(item): ItemRequest => ({
					category: ItemCategory.PhysicalGoods,
					description: item.description,
					imageUrl: item.productImages[0].url,
					name: item.name,
					quantity: item.quantity.toString(),
					sku: item.productId,
					tax: {
						currencyCode: "JPY",
						value: Math.ceil(
							(item.taxRate * item.priceBeforeTax) / 100,
						).toString(),
					},
					unitAmount: {
						currencyCode: "JPY",
						value: item.priceBeforeTax.toString(),
					},
					url:
						process.env.NEXT_PUBLIC_SERVER_URL + "/products/" + item.productId,
				}),
			);
			const resp = await ordersController.createOrder({
				body: {
					intent: CheckoutPaymentIntent.Capture,
					paymentSource: {
						paypal: {
							experienceContext: {
								returnUrl:
									process.env.NEXT_PUBLIC_SERVER_URL! + "/orders/" + order.id,
								cancelUrl: process.env.NEXT_PUBLIC_SERVER_URL! + "/checkout",
							},
						},
					},
					purchaseUnits: [
						{
							amount: {
								breakdown: {
									discount: {
										currencyCode: "JPY",
										value: order.discount.toString(),
									},
									itemTotal: {
										currencyCode: "JPY",
										value: order.itemsSubtotal.toString(),
									},
									shipping: {
										currencyCode: "JPY",
										value: order.shippingFee.toString(),
									},
									shippingDiscount: {
										currencyCode: "JPY",
										value: order.shippingDiscount.toString(),
									},
									taxTotal: {
										currencyCode: "JPY",
										value: order.taxTotal.toString(),
									},
								},
								currencyCode: "JPY",
								value: order.grandTotal.toString(),
							},
							customId: "", // webhook
							description: process.env.NEXT_PUBLIC_APP_NAME! + "での購入",
							invoiceId: order.id,
							items: items,
							payee: undefined, // マーケットプレースなどで出品者のpaypalアカウントに入金したい場合に指定
							paymentInstruction: undefined, // 上記の場合の売上分配に使用
							referenceId: undefined, // マーケットプレースなどで販売者を区別するためのもの
							shipping: {
								address: {
									addressLine1: order.shippingAddress?.street,
									addressLine2: order.shippingAddress?.building ?? undefined,
									adminArea1: order.shippingAddress?.prefecture,
									adminArea2: order.shippingAddress?.city,
									countryCode: "JP",
									postalCode: order.shippingAddress?.postalCode,
								},
								emailAddress: order.email,
								name: {
									fullName: order.shippingAddress?.name,
								},
								options: [],
								phoneNumber: undefined,
								type: undefined,
							},
							softDescriptor: process.env.NEXT_PUBLIC_APP_NAME!, //クレジットカードの明細に表示される
							supplementaryData: undefined, // より詳細なデータをカード会社に送るために必要らしい...?
						},
					],
				},
				paypalRequestId: ulid(),
				prefer: "",
			});

			if (resp.statusCode !== 200) {
				throw new Error("paypalのorderの作成に失敗");
			}

			return resp.result;
		},

		captureOrder: async () => {},
	};
};
