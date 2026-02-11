import { eq } from "drizzle-orm";
import { err, ok, Result } from "neverthrow";
import { ULID } from "ulid";
import { DB } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema/cart.schema";
import { Cart } from "@/domain/cart/cart.domain";
import { CartRepository } from "@/domain/cart/cart.domain.repository";
import { RepositoryError } from "@/domain/repository.error";

export const createCartRepository = (db: DB): CartRepository => ({
	getCartByUserID: async (
		userId: ULID,
	): Promise<Result<Cart | null, RepositoryError>> => {
		try {
			const carts = await db
				.select()
				.from(cartTable)
				.where(eq(cartTable.userId, userId))
				.limit(1);
			if (carts.length === 0) return ok(null);
			const cart = carts[0];

			const cartItems = await db
				.select()
				.from(cartItemTable)
				.where(eq(cartItemTable.cartId, cart.id));

			return ok({
				...cart,
				userId: userId,
				items: cartItems,
			});
		} catch (e) {
			console.error("error at CartRepository [getCartByUserID]: ", e);
			return err(
				new RepositoryError("カートの取得に失敗しました", { cause: e }),
			);
		}
	},

	upsert: async (cart: Cart): Promise<Result<void, RepositoryError>> => {
		try {
			await db.transaction(async (tx) => {
				// カートの存在保証
				await tx
					.insert(cartTable)
					.values({
						id: cart.id,
						userId: cart.userId,
						createdAt: cart.createdAt,
						updatedAt: cart.updatedAt,
					})
					.onConflictDoUpdate({
						target: cartTable.id,
						set: { updatedAt: cart.updatedAt },
					});

				// カートidから既存のcartItemを削除
				await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));

				if (cart.items.length === 0) return;

				const insertVal = cart.items.map((item) => ({
					...item,
					cartId: cart.id,
				}));
				await tx.insert(cartItemTable).values(insertVal);
			});
			return ok(undefined);
		} catch (e) {
			console.error("error at CartRepository [upsert]: ", e);
			return err(
				new RepositoryError("カートの更新に失敗しました", { cause: e }),
			);
		}
	},
});
