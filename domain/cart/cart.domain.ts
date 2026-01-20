import { ULID, ulid } from "ulid";

export type CartItem = {
	readonly productId: string;
	readonly quantity: number;
	readonly createdAt: Date;
	readonly updatedAt: Date;
};

export type Cart = {
	readonly id: string;
	readonly userId: string;
	readonly items: CartItem[];
	readonly createdAt: Date;
	readonly updatedAt: Date;
};

export const cartDomain = {
	createEmpty: (userID: ULID): Cart => {
		return {
			id: ulid(),
			userId: userID,
			items: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	},

	/**
	 * cart内部に指定したproductIDの商品が入っているか確認する
	 * @param cart
	 * @param productId
	 */
	hasItem: (cart: Cart, productId: ULID): boolean => {
		return cart.items.some((item) => item.productId === productId);
	},

	/**
	 * 指定したproductIDを持つ商品をカートから削除する
	 * @param cart
	 * @param productId
	 */
	deleteItem: (cart: Cart, productId: ULID): Cart => {
		const newItems = cart.items.filter((item) => item.productId !== productId);
		return {
			...cart,
			items: newItems,
			updatedAt: new Date(),
		};
	},

	/**
	 * cartに商品を追加する.負数も代入可能
	 * @param cart 既存のカート
	 * @param productId 追加する商品ID
	 * @param delta 追加する商品数(マイナス値も可)
	 * @returns Cart 商品追加後のカート
	 */
	changeQuantityBy: (cart: Cart, productId: ULID, delta: number = 1): Cart => {
		if (delta === 0) throw new Error("0以外の整数値を入力してください");
		const now = new Date();

		const exists = cartDomain.hasItem(cart, productId);
		if (!exists) {
			if (delta < 0)
				throw new Error(
					"カートに新たに商品を追加する場合には数量は0以上の整数にしてください",
				);
			const newItem = {
				productId: productId,
				quantity: delta,
				createdAt: now,
				updatedAt: now,
			};
			return {
				...cart,
				items: [...cart.items, newItem],
				updatedAt: now,
			};
		}

		const newItems: CartItem[] = [];

		for (const item of cart.items) {
			if (item.productId !== productId) {
				newItems.push(item);
				continue;
			}

			const qty = item.quantity + delta > 0 ? item.quantity + delta : 0;
			if (qty !== 0) {
				const newItem = {
					...item,
					quantity: qty,
					updatedAt: now,
				};
				newItems.push(newItem);
			}
		}

		return {
			id: cart.id,
			userId: cart.userId,
			items: newItems,
			createdAt: cart.createdAt,
			updatedAt: now,
		};
	},

	/**
	 * 与えられたproductIdの商品数をquantity個にする.
	 * 該当商品がcartに存在しない場合には, 新たに商品を追加する
	 * @param cart
	 * @param productID
	 * @param quantity
	 */
	setQuantity: (cart: Cart, productID: ULID, quantity: number): Cart => {
		if (quantity < 0) throw new Error("数量は0より大きくしてください");
		if (quantity === 0) {
			return cartDomain.deleteItem(cart, productID);
		}
		const now = new Date();

		if (!cartDomain.hasItem(cart, productID)) {
			const newItem: CartItem = {
				productId: productID,
				quantity: quantity,
				createdAt: now,
				updatedAt: now,
			};
			return {
				...cart,
				items: [...cart.items, newItem],
				updatedAt: now,
			};
		}

		const newItems = cart.items.map((item) =>
			item.productId === productID
				? {
						...item,
						quantity: quantity,
						updatedAt: now,
					}
				: item,
		);

		return {
			...cart,
			items: newItems,
			updatedAt: now,
		};
	},

	/**
	 * targetカートにsrcカートをマージする。同じ商品があった場合には多い方の個数を採用する。
	 * @param target - マージ先のメインのカート(ログインユーザーのカートなど)
	 * @param src - マージするカート(匿名ログインのカートなど)
	 * @return Cart - マージ後のカート
	 */
	mergeCartItem: (target: Cart, src: Cart): Cart => {
		const now = new Date();

		const tmpItems = new Map<ULID, CartItem>(); // (productid, item)
		target.items.forEach((item) => tmpItems.set(item.productId, item));

		for (const item of src.items) {
			const existItem = tmpItems.get(item.productId);
			if (existItem) {
				const newQuantity = Math.max(existItem.quantity, item.quantity); //ここでは一方の最大値をmergedカートに反映する
				tmpItems.set(item.productId, {
					...existItem,
					quantity: newQuantity,
					updatedAt: now,
				});
				continue;
			}

			tmpItems.set(item.productId, {
				...item,
				updatedAt: now,
			});
		}

		return {
			id: target.id,
			items: Array.from(tmpItems.values()),
			userId: target.userId,
			createdAt: target.createdAt,
			updatedAt: now,
		};
	},
};
