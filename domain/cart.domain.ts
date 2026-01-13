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


  // mergeCartItem: (cart: Cart, productID: string, quantity: number): Cart => {}
}

export interface CartRepository {
  pickCartByUserID: (userID: string) => Promise<Cart | null>;
  update: (cart: Cart) => Promise<Cart>;
}