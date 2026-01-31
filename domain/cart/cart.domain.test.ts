import { addMinute } from "@formkit/tempo";
import { isValid, ULID, ulid } from "ulid";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	TestContext,
	test,
	vi,
} from "vitest";
import { Cart, cartDomain } from "@/domain/cart/cart.domain";

type CartDomainTestContext = {
	cart: Cart;
	userID: ULID;
	defaultTime: Date;
} & TestContext;

describe("cart domain", () => {
	beforeEach<CartDomainTestContext>((context) => {
		vi.useFakeTimers();

		context.userID = ulid();
		context.defaultTime = new Date("2026-01-01T10:00:00Z");
		vi.setSystemTime(context.defaultTime);
		context.cart = cartDomain.createEmpty(context.userID);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("createEmpty", () => {
		test<CartDomainTestContext>("check empty cart is created correctly", ({
			cart,
			userID,
		}) => {
			expect(cart);
			expect(isValid(cart.userId)).toBe(true);
			expect(cart.userId).toBe(userID);
			expect(isValid(cart.id)).toBe(true);
			expect(cart.items).toEqual([]);
			expect(cart.createdAt).toBeInstanceOf(Date);
			expect(cart.updatedAt).toBeInstanceOf(Date);
		});
	});

	describe("deleteItem", () => {
		test<CartDomainTestContext>("check the product is correctly removed from cart", ({
			cart,
			defaultTime,
		}) => {
			const productID = ulid();
			const defaultCart = cartDomain.changeQuantityBy(cart, productID, 2);
			vi.setSystemTime(new Date("2026-01-01T10:10:00Z"));
			const deletedCart = cartDomain.deleteItem(defaultCart, productID);
			expect(deletedCart.items).toHaveLength(0);
			expect(deletedCart.updatedAt).toEqual(new Date("2026-01-01T10:10:00Z"));
			expect(deletedCart.createdAt).toEqual(defaultTime);
		});
	});

	describe("changeQuantityBy", () => {
		test<CartDomainTestContext>("newly add an item to cart", ({ cart }) => {
			const productID1 = ulid();
			const productID2 = ulid();
			const quantity = 2;

			const updatedCart = cartDomain.changeQuantityBy(
				cartDomain.changeQuantityBy(cart, productID1, quantity),
				productID2,
				quantity,
			);

			expect(updatedCart.items).toHaveLength(2);
			expect(updatedCart.items[0].productId).toBe(productID1);
			expect(updatedCart.items[0].quantity).toBe(quantity);
			expect(updatedCart.items[1].productId).toBe(productID2);
			expect(updatedCart.items[1].quantity).toBe(quantity);
		});

		test<CartDomainTestContext>("updates quantity and updatedAt when product already exists", ({
			cart,
			defaultTime,
		}) => {
			const productID = ulid();

			const defaultCart = cartDomain.changeQuantityBy(cart, productID, 2);

			expect(defaultCart.items).toHaveLength(1);
			expect(defaultCart.items[0].quantity).toBe(2);
			const defaultUpdatedAt = defaultCart.updatedAt;

			vi.setSystemTime(addMinute(defaultTime, 1));

			const updatedCart = cartDomain.changeQuantityBy(
				defaultCart,
				productID,
				2,
			);
			const updatedUpdatedAt = updatedCart.updatedAt;

			expect(updatedCart.items).toHaveLength(1);
			expect(updatedCart.items[0].quantity).toBe(4);

			expect(defaultUpdatedAt).lt(updatedUpdatedAt);
		});

		test<CartDomainTestContext>("throws an error when quantity change is 0", ({
			cart,
		}) => {
			const productID = ulid();

			expect(() => cartDomain.changeQuantityBy(cart, productID, 0)).toThrow(
				"0以外の整数値を入力してください",
			);
		});

		test<CartDomainTestContext>("throws an error when newly-added product's quantity is less than 0", ({
			cart,
		}) => {
			const productID = ulid();
			expect(() => cartDomain.changeQuantityBy(cart, productID, -1)).toThrow(
				"カートに新たに商品を追加する場合には数量は0以上の整数にしてください",
			);
		});

		test<CartDomainTestContext>("removes the item when quantity reaches 0", ({
			cart,
		}) => {
			const productID = ulid();
			const defaultCart = cartDomain.changeQuantityBy(cart, productID, 2);

			expect(defaultCart.items).toHaveLength(1);

			const updatedCart = cartDomain.changeQuantityBy(
				defaultCart,
				productID,
				-2,
			);
			expect(updatedCart.items).toHaveLength(0);
		});
	});

	describe("setQuantity", () => {
		test<CartDomainTestContext>("set quantity for a new product", ({
			cart,
			defaultTime,
		}) => {
			const productID = ulid();
			const defaultCart = cartDomain.setQuantity(cart, productID, 2);

			expect(defaultCart.items).toHaveLength(1);
			expect(defaultCart.items[0].quantity).toBe(2);
			expect(defaultCart.items[0].productId).toBe(productID);
			expect(defaultCart.items[0].createdAt).toEqual(defaultTime);
			expect(defaultCart.items[0].updatedAt).toEqual(defaultTime);
		});

		test<CartDomainTestContext>("change quantity when existing product", ({
			cart,
			defaultTime,
		}) => {
			const productID = ulid();
			const defaultCart = cartDomain.setQuantity(cart, productID, 2);

			const updatedTime = addMinute(defaultTime, 10);
			vi.setSystemTime(updatedTime);

			const changedCart = cartDomain.setQuantity(defaultCart, productID, 4);

			expect(changedCart.items).toHaveLength(1);
			expect(changedCart.items[0].quantity).toBe(4);
			expect(changedCart.items[0].createdAt).toEqual(defaultTime);
			expect(changedCart.items[0].updatedAt).toEqual(updatedTime);
		});

		test<CartDomainTestContext>("delete cart item when qty is set 0", ({
			cart,
		}) => {
			const productID = ulid();
			const defaultCart = cartDomain.setQuantity(cart, productID, 2);
			const changedCart = cartDomain.setQuantity(defaultCart, productID, 0);

			expect(changedCart.items).toHaveLength(0);
		});

		test<CartDomainTestContext>("throws an error when quantity is less than 0", ({
			cart,
		}) => {
			const productID = ulid();
			expect(() => cartDomain.setQuantity(cart, productID, -2)).toThrowError(
				"数量は0より大きくしてください",
			);
		});
	});

	describe("mergeCartItem", () => {
		test<CartDomainTestContext>("merge different items", ({
			cart,
			defaultTime,
		}) => {
			const productID_1 = ulid();
			const cart1 = cartDomain.setQuantity(cart, productID_1, 1);

			const productID_2 = ulid();
			const cart2 = cartDomain.setQuantity(cart, productID_2, 2);

			const updatedTime = addMinute(defaultTime, 2);
			vi.setSystemTime(updatedTime);

			const merged = cartDomain.mergeCartItem(cart1, cart2);

			expect(merged.items).toHaveLength(2);
			expect(
				merged.items.find((i) => i.productId === productID_1)?.quantity,
			).toBe(1);
			expect(
				merged.items.find((i) => i.productId === productID_2)?.quantity,
			).toBe(2);
			expect(merged.createdAt).toEqual(defaultTime);
			expect(merged.updatedAt).toEqual(updatedTime);
		});

		test<CartDomainTestContext>("merge same items - take max quantity", ({
			cart,
		}) => {
			const productID_1 = ulid();
			const cart1 = cartDomain.setQuantity(cart, productID_1, 5);
			const cart2 = cartDomain.setQuantity(cart, productID_1, 2);

			const merged = cartDomain.mergeCartItem(cart1, cart2);

			expect(merged.items).toHaveLength(1);
			expect(merged.items[0].quantity).toBe(5);
		});
	});
});
