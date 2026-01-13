import {ulid} from "ulid";

export type CartItem = {
  readonly productID: string;
  readonly quantity: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type Cart = {
  readonly id: string;
  readonly userID: string;
  readonly items: CartItem[];
  readonly createdAt: Date;
}

export const cartDomain = {
  createEmpty: (userID: string): Cart => {
    return {
      id: ulid(),
      userID: userID,
      items: [],
      createdAt: new Date(),
    }
  },

  addCartItem: (cart: Cart, productID: string, quantity: number): Cart => {
    const now = new Date()

    const exists = cart.items.some(item => item.productID === productID)
    if (!exists) {
      const newItem = {
        productID: productID,
        quantity: quantity,
        createdAt: now,
        updatedAt: now,
      }
      return {
        ...cart,
        items: [...cart.items, newItem]
      }
    }

    const newItems = cart.items.map((item) =>
      item.productID === productID
        ? {
          ...item,
          quantity: item.quantity + quantity,
          updatedAt: now,
        } : item
    )

    return {
      id: cart.id,
      userID: cart.userID,
      items: newItems,
      createdAt: cart.createdAt,
    }
  },

  removeCartItem: (cart: Cart, productID: string, quantity: number): Cart => {
    const now = new Date()

    const newItems = cart.items.map((item) =>
      item.productID === productID
        ? {
          ...item,
          quantity: item.quantity > quantity ? item.quantity - quantity : 0,
          updatedAt: now,
        } : item
    )

    // if stock is 0, remove from items
    const finalItems = newItems.filter(item => item.quantity > 0)

    return {
      id: cart.id,
      userID: cart.userID,
      items: finalItems,
      createdAt: cart.createdAt,
    }
  },


  /**
   * targetカートにsrcカートをマージする。同じ商品があった場合には多い方の個数を採用する。
   * @param target - マージ先のメインのカート(ログインユーザーのカートなど)
   * @param src - マージするカート(匿名ログインのカートなど)
   * @return Cart - マージ後のカート
   */
  mergeCartItem: (target: Cart, src: Cart): Cart => {

    const now = new Date()

    const tmpItems = new Map<string, CartItem>() // (productid, item)
    target.items.forEach(item => tmpItems.set(item.productID, item))

    for (const item of src.items) {
      const existItem = tmpItems.get(item.productID)
      if (existItem) {
        const newQuantity = Math.max(existItem.quantity, item.quantity)
        tmpItems.set(item.productID, {
          ...existItem,
          quantity: newQuantity,
          updatedAt: now,
        })
        continue
      }

      tmpItems.set(item.productID, {
        ...item,
        updatedAt: now,
      })
    }

    return {
      id: target.id,
      items: Array.from(tmpItems.values()),
      userID: target.userID,
      createdAt: target.createdAt,
    }
  }


}

export interface CartRepository {
  pickCartByUserID: (userID: string) => Promise<Cart | null>;
  update: (cart: Cart) => Promise<Cart>;
}