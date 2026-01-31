import {Product} from "@/domain/product/product.domain";

export interface ProductRepository {
  getProductByID: (id: string) => Promise<Product | null>;
  getByIDs: (ids: string[]) => Promise<Product[]>;
  getLatestProducts: (limit: number) => Promise<Product[]>;
  getProductsByCategory: (categoryId: string) => Promise<Product[]>;
  getProductsByBrand: (brandId: string) => Promise<Product[]>;
  save: (product: Product) => Promise<void>;
}