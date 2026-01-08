import {db} from "@/db";
import {cartTable} from "@/db/schema/cart.schema";
import {eq} from "drizzle-orm";

export const getOrCreateCartId = async (userId: string): Promise<string> => {
  const cart = await db.select({
    id: cartTable.id
  })
    .from(cartTable)
    .where(eq(cartTable.userId, userId))
    .limit(1)

  let cartId: string
  if (cart.length === 0) {
    cartId =
      (await db.insert(cartTable)
        .values({
          userId: userId,
        })
        .returning({id: cartTable.id}))[0].id
  } else {
    cartId = cart[0].id
  }

  return cartId
}