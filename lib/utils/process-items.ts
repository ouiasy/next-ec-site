import {GetCartItemsData} from "@/api/actions/cart.actions";

export const countItems = (cartItems: GetCartItemsData["cartItems"]): number => {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0)
}