import { createPaypalOrder } from "@/actions/checkout.paypal.actions";
import { Button } from "@/components/ui/button";

export const PaypalButton = () => {
	return (
		<form action={createPaypalOrder}>
			<Button className="w-full cursor-pointer">PayPalで決済</Button>
		</form>
	);
};
