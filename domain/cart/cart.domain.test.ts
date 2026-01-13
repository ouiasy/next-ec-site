import {describe, expect, test} from "vitest";
import {Cart, cartDomain, CartItem} from "@/domain/cart/cart.domain";

const USERID = "dummy userID"

const defaultCart: Cart = {
  id: 'cart_default',
  userID: 'user_default',
  items: [],
  createdAt: new Date(),
};


export const createMockCart = (overrides?: Partial<Cart>): Cart => {
  return {
    ...defaultCart,
    ...overrides,
  };
};

export const createMockCartItem = (overrides?: Partial<CartItem>): CartItem => {
  return {
    productID: 'prod_default',
    quantity: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

describe("cart domain", () => {

  describe("createEmpty", () => {
    test("check empty cart is created correctly", () => {
      const cart = cartDomain.createEmpty(USERID)

      expect(cart.userID).toBe(USERID)
      expect(cart.id).toBeDefined()
      expect(cart.items).toEqual([])
      expect(cart.createdAt).toBeInstanceOf(Date)
    })
  })

  describe("addCartItem", () => {
    test("add new item to cart", () => {
      const cart = cartDomain.createEmpty(USERID)
      const productID = "prod_1"
      const quantity = 2

      const updatedCart = cartDomain.addCartItem(cart, productID, quantity)

      expect(updatedCart.items).toHaveLength(1)
      expect(updatedCart.items[0].productID).toBe(productID)
      expect(updatedCart.items[0].quantity).toBe(quantity)
    })

    test("increase quantity if item already exists", () => {
      const productID = "prod_1"
      const existingItem = createMockCartItem({productID, quantity: 1})
      const cart = createMockCart({items: [existingItem]})

      const updatedCart = cartDomain.addCartItem(cart, productID, 2)

      expect(updatedCart.items).toHaveLength(1)
      expect(updatedCart.items[0].quantity).toBe(3)
    })
  })

  describe("removeCartItem", () => {
    test("reduce quantity of item", () => {
      const productID = "prod_1"
      const existingItem = createMockCartItem({productID, quantity: 5})
      const cart = createMockCart({items: [existingItem]})

      const updatedCart = cartDomain.removeCartItem(cart, productID, 2)

      expect(updatedCart.items).toHaveLength(1)
      expect(updatedCart.items[0].quantity).toBe(3)
    })

    test("remove item if quantity becomes 0 or less", () => {
      const productID = "prod_1"
      const existingItem = createMockCartItem({productID, quantity: 2})
      const cart = createMockCart({items: [existingItem]})

      const updatedCart = cartDomain.removeCartItem(cart, productID, 2)

      expect(updatedCart.items).toHaveLength(0)
    })
  })

  describe("mergeCartItem", () => {
    test("merge different items", () => {
      const cart1 = createMockCart({
        items: [createMockCartItem({productID: "prod_1", quantity: 1})]
      })
      const cart2 = createMockCart({
        items: [createMockCartItem({productID: "prod_2", quantity: 2})]
      })

      const merged = cartDomain.mergeCartItem(cart1, cart2)

      expect(merged.items).toHaveLength(2)
      expect(merged.items.find(i => i.productID === "prod_1")?.quantity).toBe(1)
      expect(merged.items.find(i => i.productID === "prod_2")?.quantity).toBe(2)
    })

    test("merge same items - take max quantity", () => {
      const cart1 = createMockCart({
        items: [createMockCartItem({productID: "prod_1", quantity: 5})]
      })
      const cart2 = createMockCart({
        items: [createMockCartItem({productID: "prod_1", quantity: 2})]
      })

      const merged = cartDomain.mergeCartItem(cart1, cart2)

      expect(merged.items).toHaveLength(1)
      expect(merged.items[0].quantity).toBe(5)
    })

    test("merge same items - take max quantity from src", () => {
      const cart1 = createMockCart({
        items: [createMockCartItem({productID: "prod_1", quantity: 2})]
      })
      const cart2 = createMockCart({
        items: [createMockCartItem({productID: "prod_1", quantity: 10})]
      })

      const merged = cartDomain.mergeCartItem(cart1, cart2)

      expect(merged.items).toHaveLength(1)
      expect(merged.items[0].quantity).toBe(10)
    })
  })
})