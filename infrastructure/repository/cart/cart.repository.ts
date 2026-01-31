import { eq } from "drizzle-orm";
import { ULID } from "ulid";
import { DB } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema/cart.schema";
import { Cart } from "@/domain/cart/cart.domain";
import { CartRepository } from "@/domain/cart/cart.domain.repository";

export const createCartRepository = (db: DB): CartRepository => ({
	getCartByUserID: async (userId: ULID): Promise<Cart | null> => {
		const carts = await db
			.select()
			.from(cartTable)
			.where(eq(cartTable.userId, userId))
			.limit(1);
		if (carts.length === 0) return null;
		const cart = carts[0];

		const cartItems = await db
			.select()
			.from(cartItemTable)
			.where(eq(cartItemTable.cartId, cart.id));

		return {
			...cart,
			userId: userId,
			items: cartItems,
		};
	},

	upsert: async (cart: Cart): Promise<void> => {
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
					set: { updatedAt: new Date() },
				});

			// カートidから既存のcartItemを削除
			await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));

			console.log("before saving: ", cart.items);
			if (cart.items.length === 0) return;

			const insertVal = cart.items.map((item) => ({
				...item,
				cartId: cart.id,
			}));
			await tx.insert(cartItemTable).values(insertVal);
		});
	},
});
