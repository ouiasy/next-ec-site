

import { ulid } from "ulid";
import {Product} from "@/domain/product.domain";

// デフォルト値を持つテスト用ファクトリ
export const createTestProduct = (
  overrides: Partial<Product> = {}
): Product => {
  const now = new Date();
  return {
    id: ulid(),
    name: "テスト商品",
    slug: "test-product",
    categories: ["test"],
    priceBeforeTax: 1000,
    taxRate: 10,
    priceAfterTax: 1100,
    brand: "テストブランド",
    numReviews: 0,
    stock: 100,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,  // 必要な部分だけ上書き
  };
};