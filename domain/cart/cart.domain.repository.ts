import { Result } from "neverthrow";
import { Cart } from "@/domain/cart/cart.domain";
import { RepositoryError } from "@/domain/repository.error";

export interface CartRepository {
	getCartByUserID: (
		userID: string,
	) => Promise<Result<Cart | null, RepositoryError>>;
	save: (cart: Cart) => Promise<Result<Cart, RepositoryError>>;
}
