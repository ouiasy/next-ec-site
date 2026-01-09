import {cartItemTable, cartTable} from "@/db/schema/cart.schema";

export type SelectCartTable = typeof cartTable.$inferSelect;
export type SelectCartItemTable = typeof cartItemTable.$inferSelect;


export type GetCartItemsData = {
  productId: string;
  slug: string;
  name: string;
  priceInTax: number;
  quantity: number;
  imageUrl: string;
};

export type GetCartItemsResponse =
  {
    data: GetCartItemsData[],
    success: true,
  } | {
  success: false,
  message: string,
  data: []
}