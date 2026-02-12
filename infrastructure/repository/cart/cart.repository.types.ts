import { cartItemTable, cartTable } from "@/db/schema/cart.schema";
import { Cart, CartItem } from "@/domain/cart/cart.domain";

export type RawCartSelect = typeof cartTable.$inferSelect;
export type RawCartItemSelect = typeof cartItemTable.$inferSelect;
export type RawCartInsert = typeof cartTable.$inferInsert;
export type RawCartItemInsert = typeof cartItemTable.$inferInsert;


export const toRawCartInsertComposite = (cart: Cart): {
	rawInsertCart: RawCartInsert, rawInsertCartItems: RawCartItemInsert[]
} => {
	const rawCart: RawCartInsert = {
		id: cart.id,
		userId: cart.userId,
		createdAt: cart.createdAt,
		updatedAt: cart.updatedAt,
	}

	const rawCartItems: RawCartItemInsert[] = cart.items.map(item => ({
		id: item.id,
		cartId: cart.id,
		productId: item.productId,
		quantity: item.quantity,

		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	}))

	return { rawCart, rawCartItems }
}

export const fromRawCartSelectComposite = (
	rawCart: RawCartSelect,
	rawCartItems: RawCartItemSelect[]
): Cart => {
	const items: CartItem[] = rawCartItems.map(item => ({
		id: item.id,
		productId: item.productId,
		quantity: item.quantity,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	}))
	return {
		id: rawCart.id,
		userId: rawCart.userId,
		items: items,
		createdAt: rawCart.createdAt,
		updatedAt: rawCart.updatedAt
	}

}

/**
 * returns
 * @param rawCart 
 */
export const fromRawEmptyCart = (rawCart: RawCartSelect): Cart => {
	return {
		id: rawCart.id,
		userId: rawCart.userId,
		items: [],
		createdAt: rawCart.createdAt,
		updatedAt: rawCart.updatedAt,
	}
}