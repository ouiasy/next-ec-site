import "server-only";

import Stripe from "stripe";
import { Cart } from "@/domain/cart/cart.domain";
import { CartDetailedResult } from "@/types/detailed-cart.type";

export interface StripeGateway {
	createSession: (
		cart: CartDetailedResult,
	) => Promise<Stripe.Response<Stripe.Checkout.Session>>;
}

export const createStripeGateway = (stripe: Stripe): StripeGateway => ({
	createSession: async (
		cart: CartDetailedResult,
	): Promise<Stripe.Response<Stripe.Checkout.Session>> => {
		const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
		for (const item of cart.items) {
			items.push({
				price_data: {
					currency: "JPY",
					product_data: {
						images: [item.productImages[0].url],
						name: item.name,
						tax_code: "txcd_99999999",
					},
					tax_behavior: "exclusive",
					unit_amount: item.priceBeforeTax,
				},
				quantity: item.quantity,
			});
		}

		return await stripe.checkout.sessions.create({
			line_items: items,
			automatic_tax: {
				enabled: true,
			},
			mode: "payment",
			success_url: `${origin}/cart?session_id={CHECKOUT_SESSION_ID}`,
		});
	},
});
