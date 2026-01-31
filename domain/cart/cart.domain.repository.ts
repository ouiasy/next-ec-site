import { Result } from "neverthrow";
import { Cart } from "@/domain/cart/cart.domain";
import { RepositoryError } from "@/infrastructure/repository/repository.error";

export interface CartRepository {
	getCartByUserID: (
		userID: string,
	) => Promise<Result<Cart | null, RepositoryError>>;
	upsert: (cart: Cart) => Promise<Result<void, RepositoryError>>;
}
