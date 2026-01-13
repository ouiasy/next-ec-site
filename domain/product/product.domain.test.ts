

import { describe, expect, test } from "vitest";
import { ulid } from "ulid";
import { Product, productDomain } from "@/domain/product/product.domain";

// デフォルト値を持つテスト用ファクトリ
export const createTestProduct = (
  overrides: Partial<Product> = {}
): Product => {
  const now = new Date();
  return {
    id: ulid(),
    name: "テスト商品",
    categoryId: ulid(),
    priceBeforeTax: 1000,
    taxRate: 10,
    priceAfterTax: 1100,
    brandId: ulid(),
    numReviews: 0,
    rating: null,
    stock: 100,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,  // 必要な部分だけ上書き
  };
};

describe("productDomain", () => {
  describe("create", () => {
    test("有効な入力で商品が作成されること", () => {
      const input = {
        name: " New Product ",
        categoryId: ulid(),
        priceBeforeTax: 2000,
        taxRate: 10,
        brandId: ulid(),
        rating: null,
        stock: 50,
        isFeatured: true,
      };

      const product = productDomain.create(input);

      expect(product.id).toBeDefined();
      expect(product.name).toBe("New Product"); // trimされていること
      expect(product.priceAfterTax).toBe(2200); // 2000 * 1.1 = 2200
      expect(product.numReviews).toBe(0);
      expect(product.createdAt).toBeInstanceOf(Date);
    });

    test("名前が空の場合はエラー", () => {
      expect(() => productDomain.create({
        name: "",
        categoryId: null,
        priceBeforeTax: 100,
        taxRate: 10,
        brandId: null,
        stock: 10,
        isFeatured: false,
        rating: null,
      })).toThrow();
    });

    test("価格が負の場合はエラー", () => {
      expect(() => productDomain.create({
        name: "Name",
        categoryId: null,
        priceBeforeTax: -1,
        taxRate: 10,
        brandId: null,
        stock: 10,
        isFeatured: false,
        rating: null,
      })).toThrow();
    });

    test("不正なcategoryIdの場合はエラー", () => {
      expect(() => productDomain.create({
        name: "Name",
        categoryId: "invalid-ulid",
        priceBeforeTax: 100,
        taxRate: 10,
        brandId: null,
        stock: 10,
        isFeatured: false,
        rating: null,
      })).toThrow();
    });
  });

  describe("reduceStock", () => {
    test("在庫を減らせること", () => {
      const product = createTestProduct({ stock: 10 });
      const updated = productDomain.reduceStock(product, 3);
      expect(updated.stock).toBe(7);
    });

    test("在庫以上の数を減らそうとするとエラー", () => {
      const product = createTestProduct({ stock: 5 });
      expect(() => productDomain.reduceStock(product, 6)).toThrow();
    });

    test("0以下の数値を指定するとエラー", () => {
      const product = createTestProduct({ stock: 5 });
      expect(() => productDomain.reduceStock(product, 0)).toThrow();
    });
  });

  describe("increaseStock", () => {
    test("在庫を増やせること", () => {
      const product = createTestProduct({ stock: 10 });
      const updated = productDomain.increaseStock(product, 5);
      expect(updated.stock).toBe(15);
    });

    test("0以下の数値を指定するとエラー", () => {
      const product = createTestProduct({ stock: 5 });
      expect(() => productDomain.increaseStock(product, 0)).toThrow();
    });
  });

  describe("addNumReviews", () => {
    test("レビュー数が1増えること", () => {
      const product = createTestProduct({ numReviews: 5 });
      const updated = productDomain.addNumReviews(product);
      expect(updated.numReviews).toBe(6);
    });
  });

  describe("changeIsFeatured", () => {
    test("注目商品の状態を変更できること", () => {
      const product = createTestProduct({ isFeatured: false });
      const updated = productDomain.changeIsFeatured(product, true);
      expect(updated.isFeatured).toBe(true);
    });
  });
});