"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { ulid } from "ulid";

export const stripeCheckout = async (prevState, formData) => {
	try {
		const headersList = await headers();
		const origin = headersList.get("origin");
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price_data: {
						currency: "JPY",
						product_data: {
							images: [
								process.env.NEXT_PUBLIC_BUCKET_URL +
									"/images/sample-products/p5-2.jpg",
							],
							metadata: {
								testmeta: "テスト用メタデータ",
							},
							name: "test name",
							tax_code: "txcd_10000000",
						},
						recurring: undefined,
						tax_behavior: "exclusive",
						unit_amount: 1000,
					},
					quantity: 1,
				},
				{
					price_data: {
						currency: "JPY",
						product_data: {
							description: "test description",
							images: [
								process.env.NEXT_PUBLIC_BUCKET_URL +
									"/images/sample-products/p5-2.jpg",
							],
							metadata: {
								testmeta: "テスト用メタデータ",
							},
							name: "test name",
							tax_code: "txcd_10000000",
						},
						recurring: undefined,
						tax_behavior: "exclusive",
						unit_amount: 1000,
					},
					quantity: 2,
				},
			],
			automatic_tax: {
				enabled: true,
			},
			mode: "payment",
			success_url: `${origin}/cart?session_id={CHECKOUT_SESSION_ID}`,
		});
		redirect(session.url);
	} catch (e) {
		if (isRedirectError(e)) throw e;
		console.log("error: ", e);
	}
};
