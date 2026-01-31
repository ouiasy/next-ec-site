import {createProductService} from "@/service/product/product.service";
import {brandRepository, cartRepository, categoryRepository, productRepository} from "@/repository";
import {createCartService} from "@/service/cart/cart.service";

export const productService = createProductService(
  productRepository,
  brandRepository,
  categoryRepository,
)

export const cartService = createCartService(
  cartRepository,
  productRepository
)