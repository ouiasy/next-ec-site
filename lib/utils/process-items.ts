import {GetCartItemsData} from "@/types/dto/response/cart.actions.response";

export const countItems = (cartItems: GetCartItemsData[]): number => {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0)
}