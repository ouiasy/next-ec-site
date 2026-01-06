import { ShippingAddrForm } from "./shipping-addr-form";
import { findShippingAddr } from "@/actions/shipping.actions";
import { CheckoutProgressBar } from "@/app/(root)/(checkout)/checkout-progress-bar";

const ShippingPage = async () => {
  const { data } = await findShippingAddr();

  return (
    <>
      <CheckoutProgressBar currentStep={1}/>
      <h2 className="text-center text-3xl py-3">配送先住所の選択</h2>
      <ShippingAddrForm address={data} />
    </>
  );
};

export default ShippingPage;
