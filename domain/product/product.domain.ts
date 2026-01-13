import {ulid, isValid} from "ulid";

export type Product = {
  readonly id: string;
  readonly name: string;
  readonly categoryId: string | null;
  readonly priceBeforeTax: number;
  readonly taxRate: number;
  readonly priceAfterTax: number; // UI表示用(orderの計算には使用しない)
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
  "id" | "priceAfterTax" | "createdAt" | "updatedAt"
    | "numReviews" | "slug"
>

export const productDomain = {
  create: (input: CreateProductInput): Product => {

    const name = input.name.trim()
    if (name.length === 0) {
      throw new Error("商品名を入力してください")
    }

    const categoryId = input.categoryId?.trim() ?? null
    const brandId = input.brandId?.trim() ?? null
    if (categoryId && !isValid(categoryId)) {
      throw new Error("カテゴリIDの形式が不正です")
    }
    if (brandId && !isValid(brandId)) {
      throw new Error("ブランドIDの形式が不正です")
    }

    if (input.priceBeforeTax < 0) {
      throw new Error("税抜き金額は0以上で入力してください")
    }
    if (input.taxRate < 0) {
      throw new Error("税率は0%以上で入力してください")
    }
    if (input.stock < 0) {
      throw new Error("在庫数は0以上で入力してください")
    }

    const priceAfterTax = Math.ceil(input.priceBeforeTax * (1 + input.taxRate/100))

    const nowTime = new Date()
    return {
      id: ulid(),
      name: name,
      categoryId: categoryId,
      priceBeforeTax: input.priceBeforeTax,
      priceAfterTax: priceAfterTax,
      taxRate: input.taxRate,
      brandId: brandId,
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
      throw new Error("在庫の減算数は1以上で指定してください")
    }
    if (product.stock < by) {
      throw new Error(`在庫が不足しています（現在: ${product.stock}）`)
    }
    return {
      ...product,
      stock: product.stock - by,
    }
  },

  increaseStock: (product: Product, by: number): Product => {
    if (by <= 0) {
      throw new Error("在庫の加算数は1以上で指定してください")
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
