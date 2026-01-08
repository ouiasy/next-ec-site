import { getCartItems } from "@/api/actions/cart.actions";
import { CartTable } from "./cart-table";
import { TotalPriceCard } from "./total-price-card";

const CartPage = async () => {
  const cart = await getCartItems();
  return (
    <div className="py-10">
      <h2 className="text-3xl py-4">Shopping Cart</h2>
      <div className="grid md:grid-cols-4 gap-5">
        {cart.success ? (
          <>
            <div className="md:col-span-3">
              <CartTable items={cart.data} />
            </div>
            <div className="md:col-span-1">
              <TotalPriceCard items={cart.data} />
            </div>
          </>
        ) : (
          <div>cart not found</div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
