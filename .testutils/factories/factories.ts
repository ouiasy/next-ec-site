import { ulid } from "ulid";
import { Brand } from "@/domain/brand/brand.domain";
import { Category } from "@/domain/category/category.domain";
import { Product, ProductImage } from "@/domain/product/product.domain";

export const createTestProductImage = (
	overrides: Partial<Product> = {},
): ProductImage => ({
	id: ulid(),
	url: "http://example.com",
	imageName: "test image name",
	displayOrd: 0,
	createdAt: new Date(),
	updatedAt: new Date(),
});

export const createTestProduct = (
	overrides: Partial<Product> = {},
): Product => ({
	id: ulid(),
	name: "test product",
	description: "test description",
	categoryId: null,
	brandId: null,
	priceBeforeTax: 1000,
	taxRate: 10,
	priceAfterTax: 1100,
	numReviews: 1,
	rating: null,
	stock: 5,	
	productImages: [],
	isFeatured: false,
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides,
});

export const createTestCategory = (overrides: Partial<Category> = {}): Category => ({
	id: ulid(),
	name: "test category",
	description: "test category description",
	parentId: null,
  ...overrides,
});

export const createTestBrand = (overrides: Partial<Brand> = {}): Brand => ({
  id: ulid(),
  name: "test brand",
  description: "test brand description"
})
