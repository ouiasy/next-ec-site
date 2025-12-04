import { ShippingAddrForm } from "./shipping-addr-form";
import { findShippingAddr } from "@/actions/shipping.actions";

const ShippingPage = async () => {
  const { data } = await findShippingAddr();

  return (
    <div>
      <ShippingAddrForm address={data} />
    </div>
  );
};

export default ShippingPage;
