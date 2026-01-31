import { getCartItems } from "@/actions/cart.actions";
import { ShippingAddrCard } from "@/app/(root)/(checkout)/checkout/shipping-addr-card";
import { TotalPriceWithPaymentMethod } from "@/app/(root)/(checkout)/checkout/total-price-with-payment-method";
import { CartTable } from "@/components/shared/cart/cart-table";
import { Card } from "@/components/ui/card";

const TestPage = async () => {
	const resp = await getCartItems();
	return (
		<div className="flex mt-10 gap-5">
			<div className="flex flex-col gap-10 flex-3">
				<ShippingAddrCard />
				<Card>
					<CartTable items={resp.data.items} />
				</Card>
			</div>
			<div className="flex-2">
				<TotalPriceWithPaymentMethod />
			</div>
		</div>
	);
};

export default TestPage;
