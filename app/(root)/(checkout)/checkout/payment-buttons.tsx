import { PaypalButton } from "@/app/(root)/(checkout)/checkout/paypal-btn";
import { StripeButton } from "@/app/(root)/(checkout)/checkout/stripe-btn";

export const PaymentButtons = () => {
	return (
		<div className="space-y-3">
			<StripeButton />
			<PaypalButton />
		</div>
	);
};
