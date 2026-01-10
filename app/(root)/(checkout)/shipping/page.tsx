import { ShippingAddrForm } from "./shipping-addr-form";
import { findShippingAddr } from "@/api/actions/shipping.actions";
import { CheckoutProgressBar } from "@/app/(root)/(checkout)/checkout-progress-bar";
import React from "react";

const ShippingPage = async () => {
  const addresses = await findShippingAddr();
  return (
    <>
      <CheckoutProgressBar currentStep={1}/>
      <h2 className="text-center text-3xl py-3">配送先住所の選択</h2>
      <div className="max-w-1/2 mx-auto">
        <ShippingAddrForm />
      </div>
    </>
  );
};

export default ShippingPage;
