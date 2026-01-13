import {createCartRepository} from "@/repository/cart.repository";
import {db} from "@/db";

export const cartRepository = createCartRepository(db)