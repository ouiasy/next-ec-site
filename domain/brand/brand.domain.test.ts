import { describe, expect, test } from "vitest";
import { brandDomain, Brand } from "./brand.domain";

describe("brandDomain", () => {
  describe("create", () => {
    test("有効な名前と説明でブランドを作成できる", () => {
      const name = "ブランド名";
      const description = "ブランドの説明";
      const brand = brandDomain.create(name, description);

      expect(brand.id).toBeDefined();
      expect(brand.name).toBe(name);
      expect(brand.description).toBe(description);
    });

    test("名前が空（または空白のみ）の場合はエラーを投げる", () => {
      expect(() => brandDomain.create("", "説明")).toThrow("ブランド名は1文字以上にしてください");
      expect(() => brandDomain.create("   ", "説明")).toThrow("ブランド名は1文字以上にしてください");
    });

    test("説明が空（または空白のみ）の場合はエラーを投げる", () => {
      expect(() => brandDomain.create("名前", "")).toThrow("詳細説明は1文字以上入れてください");
      expect(() => brandDomain.create("名前", "   ")).toThrow("詳細説明は1文字以上入れてください");
    });

    test("名前と説明の前後から空白が削除される", () => {
      const brand = brandDomain.create("  Brand  ", "  Description  ");
      expect(brand.name).toBe("Brand");
      expect(brand.description).toBe("Description");
    });
  });

  describe("changeName", () => {
    const initialBrand: Brand = {
      id: "id_1",
      name: "Old Name",
      description: "Description"
    };

    test("ブランド名を変更できる", () => {
      const updatedBrand = brandDomain.changeName(initialBrand, "New Name");
      expect(updatedBrand.name).toBe("New Name");
      expect(updatedBrand.id).toBe(initialBrand.id);
      expect(updatedBrand.description).toBe(initialBrand.description);
    });

    test("新しい名前が空（または空白のみ）の場合はエラーを投げる", () => {
      expect(() => brandDomain.changeName(initialBrand, "")).toThrow("ブランド名は1文字以上にしてください");
      expect(() => brandDomain.changeName(initialBrand, "  ")).toThrow("ブランド名は1文字以上にしてください");
    });

    test("新しい名前の前後から空白が削除される", () => {
      const updatedBrand = brandDomain.changeName(initialBrand, "  New Name  ");
      expect(updatedBrand.name).toBe("New Name");
    });
  });

  describe("changeDescription", () => {
    const initialBrand: Brand = {
      id: "id_1",
      name: "Name",
      description: "Old Description"
    };

    test("説明を変更できる", () => {
      const updatedBrand = brandDomain.changeDescription(initialBrand, "New Description");
      expect(updatedBrand.description).toBe("New Description");
      expect(updatedBrand.id).toBe(initialBrand.id);
      expect(updatedBrand.name).toBe(initialBrand.name);
    });

    test("新しい説明が空（または空白のみ）の場合はエラーを投げる", () => {
      expect(() => brandDomain.changeDescription(initialBrand, "")).toThrow("詳細説明は1文字以上入れてください");
      expect(() => brandDomain.changeDescription(initialBrand, "  ")).toThrow("詳細説明は1文字以上入れてください");
    });

    test("新しい説明の前後から空白が削除される", () => {
      const updatedBrand = brandDomain.changeDescription(initialBrand, "  New Description  ");
      expect(updatedBrand.description).toBe("New Description");
    });
  });
});
