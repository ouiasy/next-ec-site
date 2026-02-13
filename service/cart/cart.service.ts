import { CartRepository } from "@/domain/cart/cart.domain.repository";
import { ProductRepository } from "@/domain/product/product.domain.repository";
import {
	CartDetailedResult,
	DetailedCartItem,
} from "@/types/detailed-cart.type";

export const createCartService = (
	cartRepo: CartRepository,
	productRepo: ProductRepository,
) => {
	return {
		getCartDetail: async (
			userId: string,
		): Promise<CartDetailedResult | null> => {
			const cart = await cartRepo.getCartByUserID(userId);
			if (cart === null) return null;

			const productIds = cart.items.map((item) => item.productId);

			const products = await productRepo.getByIDs(productIds);

			const productMap = new Map(products.map((p) => [p.id, p]));

			const cartItems = [];
			let subTotal = 0;
			let taxTotal = 0;
			for (const item of cart.items) {
				const product = productMap.get(item.productId);
				if (product === undefined) {
					console.warn(`product ${item.productId} not found`);
					continue;
				}

				const actualQty =
					item.quantity > product.stock ? product.stock : item.quantity;

				if (actualQty === 0) continue;

				const cartItem: DetailedCartItem = {
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
				};

				subTotal += product.priceBeforeTax * cartItem.quantity;
				taxTotal +=
					product.taxRate * product.priceBeforeTax * cartItem.quantity;
				cartItems.push(cartItem);
			}

			// 忘れずに: taxTotalを100で割る
			taxTotal = Math.floor(taxTotal / 100);

			return {
				items: cartItems,
				subTotal: subTotal,
				taxTotal: taxTotal,
				grandTotal: subTotal + taxTotal,
			};
		},
	};
};
