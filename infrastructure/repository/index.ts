import {createCartRepository} from "@/infrastructure/repository/cart/cart.repository";
import {db} from "@/db";
import {createProductRepository} from "@/infrastructure/repository/product/product.repository";
import {createBrandRepository} from "@/infrastructure/repository/brand/brand.repository";
import {createCategoryRepository} from "@/infrastructure/repository/category/category.repository";

export const cartRepository = createCartRepository(db)
export const productRepository = createProductRepository(db)
export const brandRepository = createBrandRepository(db)
export const categoryRepository = createCategoryRepository(db)