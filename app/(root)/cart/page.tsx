import {getCartItems} from "@/actions/cart.actions";
import {CartTable} from "./cart-table";

const CartPage = async () => {
  const cart = await getCartItems();
  console.log("called", cart)
  return (
      <div className="py-10">
        <h2 className="text-3xl py-4">Shopping Cart</h2>
        <div className="grid md:grid-cols-4 gap-5">
          {
            cart.data?.cartItems ? (
                <>
                  <div className="col-span-3">
                    <CartTable items={cart.data?.cartItems}/>
                  </div>
                  <div></div>
                </>
            ) : (
                <div>cart not found</div>
            )
          }
        </div>
      </div>
  );
};

export default CartPage;
