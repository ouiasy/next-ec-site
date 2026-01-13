import {Cart, CartRepository} from "@/domain/cart.domain";
import {cartItemTable, cartTable} from "@/db/schema/cart.schema";
import {eq} from "drizzle-orm";
import {DB} from "@/db";


export const createCartRepository = (
  db: DB
): CartRepository => ({
  pickCartByUserID: async (userID: string): Promise<Cart | null> => {
    const rows = await db.select({
      id: cartTable.id,
      productID: cartItemTable.productId,
      quantity: cartItemTable.quantity,
      cartItemCreatedAt: cartItemTable.createdAt,
      cartItemUpdatedAt: cartItemTable.updatedAt,
      cartCreatedAt: cartTable.createdAt
    })
      .from(cartTable)
      .where(eq(cartTable.userId, userID))
      .innerJoin(cartItemTable, eq(cartTable.id, cartItemTable.cartId))

    const firstRow = rows[0]
    const items = rows.map(item => ({
      productID: item.productID,
      quantity: item.quantity,
      createdAt: item.cartItemCreatedAt,
      updatedAt: item.cartItemUpdatedAt,
    }))

    return {
      id: firstRow.id,
      userID: userID,
      items: items,
      createdAt: firstRow.cartCreatedAt
    }
  },


  update: async (cart: Cart): Promise<Cart> => {
    // todo sabunnkousin wasurezuni
    throw new Error("not implemented")
  }

})

