import { db } from "@/db"
import { cartItemTable, cartTable } from "@/db/schema/cart.schema";
import { eq, max, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/sqlite-core";

export const mergeAnonymousCart =
  async (anonymousUserId: string, newUserId: string) => {
    //
    try {
      const anonymousCartId = await getCartId(anonymousUserId)
      const newUserCartId = await getCartId(newUserId)

      // anonymousUserIdのもつ商品を取得
      const itemsByAnonymous =
        db.select({
          cartId: cartItemTable.id,
          productId: cartItemTable.productId,
          quantity: cartItemTable.quantity,
        })
          .from(cartItemTable)
          .where(eq(cartItemTable.cartId, anonymousCartId))

      // newUserIdのもつ商品を取得
      const itemsByNewUser =
        db.select({
          cartId: cartItemTable.id,
          productId: cartItemTable.productId,
          quantity: cartItemTable.quantity,
        })
          .from(cartItemTable)
          .where(eq(cartItemTable.cartId, newUserCartId))

      const unionCartItems =
        db.$with("unionCartItems")
          .as(unionAll(itemsByAnonymous, itemsByNewUser))

      const mergedItems =
        await db.with(unionCartItems)
          .select({
            productId: unionCartItems.productId,
            quantity: max(unionCartItems.quantity)
          })
          .from(unionCartItems)
          .groupBy(unionCartItems.productId)

      if (mergedItems.length === 0) {
        return
      }

      const itemsToInsert = mergedItems.map(item => ({
        cartId: newUserCartId,
        productId: item.productId,
        // ここで null チェック (maxの結果がnullなら1など適切なデフォルト値を入れる)
        quantity: item.quantity ?? 0,
      }))

      await db.insert(cartItemTable)
        .values(itemsToInsert).onConflictDoUpdate({
          target: [cartItemTable.cartId, cartItemTable.productId],
          set: {
            quantity: sql`excluded.quantity`
          }
        })

      await db.delete(cartTable).where(eq(cartTable.userId, anonymousUserId))

    } catch (e) {
      throw e
    }
  }

export const getCartId = async (userId: string): Promise<string> => {
  const res = await db
    .select({ cartId: cartTable.id })
    .from(cartTable)
    .where(eq(cartTable.userId, userId))
    .limit(1)

  return res[0].cartId

}

