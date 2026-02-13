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
import { ExperienceContextShippingPreference } from "@paypal/paypal-server-sdk";



describe("cart domain", () => {
	const defaultTime = new Date("2026-01-01T10:00:00Z");
	const userID = ulid();

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(defaultTime);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("createEmpty", () => {
		test("check empty cart is created correctly", () => {
			
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			expect(isValid(cart.userId)).toBe(true);
			expect(cart.userId).toBe(userID);
			expect(isValid(cart.id)).toBe(true);
			expect(cart.items).toEqual([]);
			expect(cart.createdAt).toEqual(defaultTime);
			expect(cart.updatedAt).toEqual(defaultTime);
		});
	});

	describe("getQty", () => {
		test("check the product quantity is correctly retrieved from cart", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();
			const defaultCart = cartDomain.changeQuantityBy(cart, productID, 2)._unsafeUnwrap();
			expect(cartDomain.getQty(defaultCart, productID)._unsafeUnwrap()).toBe(2);
		});

		test("check the product quantity is 0 when product is not in cart", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();
			expect(cartDomain.getQty(cart, productID).isErr()).toBe(true);
		});
	})

	describe("deleteItem", () => {
		test("check the product is correctly removed from cart", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();
			const defaultCart = cartDomain.changeQuantityBy(cart, productID, 2)._unsafeUnwrap();
			vi.advanceTimersByTime(1000);
			const deletedCart = cartDomain.deleteItem(defaultCart, productID);
			expect(deletedCart.items).toHaveLength(0);
			expect(deletedCart.updatedAt).greaterThan(defaultTime);
			expect(deletedCart.createdAt).toEqual(defaultTime);
		});
	});

	describe("changeQuantityBy", () => {
		test("newly add an item to cart", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID1 = ulid();
			const productID2 = ulid();
			const quantity = 2;

			vi.advanceTimersByTime(1000);

			const updatedCart = cartDomain.changeQuantityBy(
				cartDomain.changeQuantityBy(cart, productID1, quantity)._unsafeUnwrap(),
				productID2,
				quantity,
			)._unsafeUnwrap();

			expect(updatedCart.items).toHaveLength(2);
			expect(updatedCart.createdAt).toEqual(defaultTime);
			expect(updatedCart.updatedAt).greaterThan(defaultTime);

			expect(updatedCart.items[0].productId).toBe(productID1);
			expect(updatedCart.items[0].quantity).toBe(quantity);
			expect(updatedCart.items[0].createdAt).greaterThan(defaultTime);
			expect(updatedCart.items[0].updatedAt).greaterThan(defaultTime);

			expect(updatedCart.items[1].productId).toBe(productID2);
			expect(updatedCart.items[1].quantity).toBe(quantity);
			expect(updatedCart.items[1].createdAt).greaterThan(defaultTime);
			expect(updatedCart.items[1].updatedAt).greaterThan(defaultTime);
		});

		test("updates quantity and updatedAt when product already exists", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();

			const cartWithItem = cartDomain.changeQuantityBy(cart, productID, 2)._unsafeUnwrap();

			expect(cartWithItem.items).toHaveLength(1);
			expect(cartWithItem.items[0].quantity).toBe(2);
			const defaultUpdatedAt = cartWithItem.updatedAt;

			vi.setSystemTime(addMinute(defaultTime, 1));

			const updatedCart = cartDomain.changeQuantityBy(
				cartWithItem,
				productID,
				2,
			)._unsafeUnwrap();
			const updatedUpdatedAt = updatedCart.updatedAt;

			expect(updatedCart.items).toHaveLength(1);
			expect(updatedCart.items[0].quantity).toBe(4);

			expect(defaultUpdatedAt).lt(updatedUpdatedAt);
		});

		test("throws an error when quantity change is 0", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();

			const res = cartDomain.changeQuantityBy(cart, productID, 0);

			expect(res.isErr()).toBe(true);
		});

		test("throws an error when newly-added product's quantity is less than 0", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();
			const res = cartDomain.changeQuantityBy(cart, productID, -1);
			expect(res.isErr()).toBe(true);
		});

		test("removes the item when quantity reaches 0", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();
			const updatedCart = cartDomain.changeQuantityBy(cart, productID, 2)._unsafeUnwrap();

			expect(updatedCart.items).toHaveLength(1);

			const deletedCart = cartDomain.changeQuantityBy(
				updatedCart,
				productID,
				-2,
			)._unsafeUnwrap();
			expect(deletedCart.items).toHaveLength(0);
		});
	});

	describe("setQuantity", () => {
		test("set quantity for a new product", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();

			vi.advanceTimersByTime(1000);
			const defaultCart = cartDomain.setQuantity(cart, productID, 2)._unsafeUnwrap();

			expect(defaultCart.items).toHaveLength(1);
			expect(defaultCart.createdAt).toEqual(defaultTime);
			expect(defaultCart.updatedAt).gt(defaultTime);
			expect(defaultCart.items[0].quantity).toBe(2);
			expect(defaultCart.items[0].productId).toBe(productID);
			expect(defaultCart.items[0].createdAt).gt(defaultTime);
			expect(defaultCart.items[0].updatedAt).gt(defaultTime);
		});

		test("change quantity when product already exists", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();
			const defaultCart = cartDomain.setQuantity(cart, productID, 2)._unsafeUnwrap();

			const updatedTime = addMinute(defaultTime, 10);
			vi.setSystemTime(updatedTime);

			const changedCart = cartDomain.setQuantity(defaultCart, productID, 4)._unsafeUnwrap();

			expect(changedCart.items).toHaveLength(1);
			expect(changedCart.items[0].quantity).toBe(4);
			expect(changedCart.items[0].createdAt).toEqual(defaultTime);
			expect(changedCart.items[0].updatedAt).toEqual(updatedTime);
		});

		test("delete cart item when qty is set 0", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();
			const defaultCart = cartDomain.setQuantity(cart, productID, 2)._unsafeUnwrap();
			const changedCart = cartDomain.setQuantity(defaultCart, productID, 0)._unsafeUnwrap();

			expect(changedCart.items).toHaveLength(0);
		});

		test("throws an error when quantity is less than 0", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID = ulid();
			const res = cartDomain.setQuantity(cart, productID, -2);
			expect(res.isErr()).toBe(true);
		});
	});

	describe("mergeCartItem", () => {
		test("merge different items", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID_1 = ulid();
			const cart1 = cartDomain.setQuantity(cart, productID_1, 1)._unsafeUnwrap();

			const productID_2 = ulid();
			const cart2 = cartDomain.setQuantity(cart, productID_2, 2)._unsafeUnwrap();

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

		test("merge same items - take max quantity", () => {
			const cart = cartDomain.createEmpty(userID)._unsafeUnwrap();
			const productID_1 = ulid();
			const cart1 = cartDomain.setQuantity(cart, productID_1, 5)._unsafeUnwrap();
			const cart2 = cartDomain.setQuantity(cart, productID_1, 2)._unsafeUnwrap();

			const merged = cartDomain.mergeCartItem(cart1, cart2);

			expect(merged.items).toHaveLength(1);
			expect(merged.items[0].quantity).toBe(5);
		});
	});
});
