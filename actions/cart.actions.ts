"use server";

import {CartItemType} from "@/types/cart";

export const AddItemToCart = async (item: CartItemType) => {
  return {
    success: true, message: "added to cart successfully."
  }
}