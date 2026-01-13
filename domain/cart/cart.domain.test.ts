import {describe, expect, test} from "vitest";
import {Cart, cartDomain, CartItem} from "@/domain/cart/cart.domain";

const USERID = "dummy userID"
// デフォルト値（ひな形）
const defaultCart: Cart = {
  id: 'cart_default',
  userID: 'user_default',
  items: [],
  createdAt: new Date(),
};

// ★ここが魔法の関数（Partialを使うのがコツ）
export const createMockCart = (overrides?: Partial<Cart>): Cart => {
  return {
    ...defaultCart, // デフォルト値を展開
    ...overrides,   // 引数で渡された値だけ上書き
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

  describe("createEmpty function", () => {
    test("check empty cart is created correctly", () => {
      const cart = cartDomain.createEmpty(USERID)

      expect(cart.userID).toBe(USERID)
      expect(cart.id).toBeDefined()
      expect(cart.items).toEqual([])
      expect(cart.createdAt).toBeInstanceOf(Date)
    })
  })

  describe("addCartItem function", () => {

  })

  // describe("removeCartItem function", () => {
  //
  // })
})