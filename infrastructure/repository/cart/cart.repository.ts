import { eq } from "drizzle-orm";
import { err, ok, Result } from "neverthrow";
import { ULID } from "ulid";
import { DB } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema/cart.schema";
import { Cart } from "@/domain/cart/cart.domain";
import { CartRepository } from "@/domain/cart/cart.domain.repository";
import { RepositoryError } from "@/domain/repository.error";
import { fromRawCartSelectComposite, fromRawEmptyCart, RawCartSelect, toRawCartInsertComposite } from "./cart.repository.types";


export const createCartRepository = (db: DB): CartRepository => ({
	getCartByUserID: async (
		userId: ULID,
	): Promise<Result<Cart | null, RepositoryError>> => {
		try {
			const rawCarts = await db
				.select()
				.from(cartTable)
				.where(eq(cartTable.userId, userId))
				.limit(1);
			if (rawCarts.length === 0) return ok(null);
			const cartId = rawCarts[0].id;

			const rawCartItems = await db
				.select()
				.from(cartItemTable)
				.where(eq(cartItemTable.cartId, cartId));

			const cart = fromRawCartSelectComposite(rawCarts[0], rawCartItems)

			return ok(cart);
		} catch (e) {
			return err(
				new RepositoryError("カートの取得に失敗しました", { cause: e }),
			);
		}
	},

	save: async (cart: Cart): Promise<Result<Cart, RepositoryError>> => {
		try {
			const txRes = await db.transaction(async (tx) => {
				const { rawInsertCart, rawInsertCartItems } = toRawCartInsertComposite(cart);
				const rawSelectCart: RawCartSelect[] = await tx
					.insert(cartTable)
					.values(rawInsertCart)
					.onConflictDoUpdate({
						target: cartTable.id,
						set: { updatedAt: rawInsertCart.updatedAt },
					}).returning();

				await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, rawSelectCart[0].id));

				if (rawInsertCartItems.length === 0) {
					return fromRawEmptyCart(rawSelectCart[0])
				}

				const rawSelectCartItems = await tx
					.insert(cartItemTable)
					.values(rawInsertCartItems)
					.returning();

				const res =  fromRawCartSelectComposite(rawSelectCart[0], rawSelectCartItems)

				return res
			});
			return ok(txRes);
		} catch (e) {
			return err(
				new RepositoryError("カートの更新に失敗しました", { cause: e }),
			);
		}
	},
});
