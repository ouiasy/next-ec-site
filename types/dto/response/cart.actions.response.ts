import {cartItemTable, cartTable} from "@/db/schema/cart.schema";

export type SelectCartTable = typeof cartTable.$inferSelect;
export type SelectCartItemTable = typeof cartItemTable.$inferSelect;


export type GetCartItemsData = {
  productId: string | null;
  slug: string | null;
  name: string | null;
  priceInTax: number | null;
  quantity: number | null;
  imageUrl: string | null;
};

export type GetCartItemsResponse =
  {
    data: GetCartItemsData[] | [],
    success: true,
  } | {
  success: false,
  message: string,
  data: []
}