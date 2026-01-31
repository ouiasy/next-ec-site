import {Cart} from "@/domain/cart/cart.domain";

export interface CartRepository {
    getCartByUserID: (userID: string) => Promise<Cart | null>;
    save: (cart: Cart) => Promise<void>;
}

