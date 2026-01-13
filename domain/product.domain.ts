import {ulid, isValid} from "ulid";

export type Product = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly categoryId: string | null;
  readonly priceBeforeTax: number;
  readonly taxRate: number;
  readonly priceAfterTax: number;
  readonly brandId: string | null;
  readonly numReviews: number;
  readonly rating: number | null;
  readonly stock: number;
  readonly isFeatured: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

type CreateProductInput = Omit<
  Product,
  "id" | "priceAfterTax" | "createdAt" | "updatedAt" | "numReviews"
>

export const productDomain = {
  create: (input: CreateProductInput): Product => {

    const name = input.name.trim()
    const slug = input.slug.trim()
    const categoryId = input.categoryId?.trim() ?? null
    const brandId = input.brandId?.trim() ?? null
    if (name.length === 0) {
      throw new Error("")
    }
    if (slug.length === 0) {
      throw new Error("")
    }
    if (categoryId && !isValid(categoryId)) {
      throw new Error("")
    }
    if (brandId && !isValid(brandId)) {
      throw new Error("")
    }

    if (input.priceBeforeTax < 0) {
      throw new Error("")
    }
    if (input.taxRate < 0) {
      throw new Error("")
    }
    if (input.stock < 0) {
      throw new Error("")
    }

    const priceAfterTax = Math.ceil(input.priceBeforeTax * (1 + input.taxRate/100))

    const nowTime = new Date()
    return {
      id: ulid(),
      name: name,
      slug: slug,
      categoryId: categoryId ?? null,
      priceBeforeTax: input.priceBeforeTax,
      priceAfterTax: priceAfterTax,
      taxRate: input.taxRate,
      brandId: brandId ?? null,
      numReviews: 0,
      rating: null,
      stock: input.stock,
      isFeatured: input.isFeatured,
      createdAt: nowTime,
      updatedAt: nowTime
    }
  },

  reduceStock: (product: Product, by: number): Product => {
    if (by <= 0) {
      throw new Error("")
    }
    if (product.stock < by) {
      throw new Error("")
    }
    return {
      ...product,
      stock: product.stock - by,
    }
  },

  increaseStock: (product: Product, by: number): Product => {
    if (by <= 0) {
      throw new Error("")
    }
    return {
      ...product,
      stock: product.stock + by,
    }
  },

  addNumReviews: (product: Product): Product => {
    return {
      ...product,
      numReviews: product.numReviews + 1,
    }
  },

  changeIsFeatured: (product: Product, state: boolean): Product => {
    return {
      ...product,
      isFeatured: state,
    }
  }

}

export interface ProductRepository {
  Update(product: Product): Promise<Product>
}
