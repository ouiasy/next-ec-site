import {findShippingAddr} from "@/api/actions/shipping.actions";
import {CheckoutProgressBar} from "@/app/(root)/(checkout)/checkout-progress-bar";
import React from "react";
import {AddressManager} from "@/app/(root)/(checkout)/shipping/address-manager";


const ShippingPage = async () => {
  const data = await findShippingAddr();
  return (
    <>
      <CheckoutProgressBar currentStep={1}/>
      <h2 className="text-center text-3xl py-3 mb-6">配送先住所の選択</h2>

      <AddressManager data={data}/>
    </>
  );
};

export default ShippingPage;
