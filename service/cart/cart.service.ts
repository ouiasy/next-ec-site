import {CartRepository} from "@/domain/cart/cart.domain.repository";
import {ProductRepository} from "@/domain/product/product.domain.repository";

type CartItem = {
  readonly productId: string;

  readonly productImages: ProductImage[];

  readonly name: string;
  readonly quantity: number;

  readonly taxRate: number;
  readonly priceBeforeTax: number;
  readonly priceAfterTax: number;

  readonly rating: number | null;
  readonly numReviews: number;

  readonly isFeatured: boolean;
}

type ProductImage = {
  readonly url: string;
  readonly imageAlt: string　| null;
  readonly displayOrd: number;
}

export type CartDetailResult = {
  readonly items: CartItem[];
  readonly subTotal: number;
  readonly taxTotal: number;
  readonly grandTotal: number;
}

export const createCartService = (
  cartRepo: CartRepository,
  productRepo: ProductRepository,
) => {
  return {
    getCartDetail: async (userId: string): Promise<CartDetailResult | null> => {
      const cart = await cartRepo.getCartByUserID(userId)
      if (cart === null) return null

      const productIds = cart.items.map(item => item.productId)

      const products = await productRepo.getByIDs(productIds)

      const productMap = new Map(products.map(p => [p.id, p]))

      const cartItems = []
      let subTotal = 0
      let taxTotal = 0
      for (const item of cart.items) {
        const product = productMap.get(item.productId)
        if (product === undefined) {
          console.warn(`product ${item.productId} not found`)
          continue
        }

        const actualQty = item.quantity > product.stock
          ? product.stock : item.quantity;

        if (actualQty === 0) continue

        const cartItem: CartItem = {
          productId: item.productId,
          productImages: product.productImages,

          name: product.name,
          quantity: actualQty,

          taxRate: product.taxRate,
          priceBeforeTax: product.priceBeforeTax,
          priceAfterTax: product.priceAfterTax,

          rating: product.rating,
          numReviews: product.numReviews,

          isFeatured: product.isFeatured,
        }

        subTotal += product.priceBeforeTax * cartItem.quantity
        taxTotal += product.taxRate
          * product.priceBeforeTax
          * cartItem.quantity
        cartItems.push(cartItem)
      }

      // 忘れずに: taxTotalを100で割る
      taxTotal = Math.floor(taxTotal / 100)

      return {
        items: cartItems,
        subTotal: subTotal,
        taxTotal: taxTotal,
        grandTotal: subTotal + taxTotal,
      }
    },
  }
}