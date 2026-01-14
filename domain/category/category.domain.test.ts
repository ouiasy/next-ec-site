import { describe, expect, test } from "vitest";
import { categoryDomain, Category } from "./category.domain";
import { ulid } from "ulid";

describe("categoryDomain", () => {
  describe("create", () => {
    test("有効な名前と説明でカテゴリを作成できる", () => {
      const name = "カテゴリ名";
      const description = "カテゴリの説明";
      const category = categoryDomain.create(name, description);

      expect(category.id).toBeDefined();
      expect(category.name).toBe(name);
      expect(category.description).toBe(description);
      expect(category.parentId).toBeNull();
    });

    test("親カテゴリIDを指定してカテゴリを作成できる", () => {
      const name = "カテゴリ名";
      const description = "カテゴリの説明";
      const parentId = ulid();
      const category = categoryDomain.create(name, description, parentId);

      expect(category.parentId).toBe(parentId);
    });

    test("名前が空（または空白のみ）の場合はエラーを投げる", () => {
      expect(() => categoryDomain.create("", "説明")).toThrow("カテゴリ名は1文字以上にしてください");
      expect(() => categoryDomain.create("   ", "説明")).toThrow("カテゴリ名は1文字以上にしてください");
    });

    test("説明が空（または空白のみ）の場合はエラーを投げる", () => {
      expect(() => categoryDomain.create("名前", "")).toThrow("カテゴリの説明は1文字以上にしてください");
      expect(() => categoryDomain.create("名前", "   ")).toThrow("カテゴリの説明は1文字以上にしてください");
    });

    test("不正な形式の親カテゴリIDの場合はエラーを投げる", () => {
      expect(() => categoryDomain.create("名前", "説明", "invalid-id")).toThrow("不正な親カテゴリです");
    });

    test("名前と説明の前後から空白が削除される", () => {
      const category = categoryDomain.create("  Category  ", "  Description  ");
      expect(category.name).toBe("Category");
      expect(category.description).toBe("Description");
    });
  });

  describe("changeName", () => {
    const initialCategory: Category = {
      id: ulid(),
      name: "Old Name",
      description: "Description",
      parentId: null
    };

    test("カテゴリ名を変更できる", () => {
      const updatedCategory = categoryDomain.changeName(initialCategory, "New Name");
      expect(updatedCategory.name).toBe("New Name");
      expect(updatedCategory.id).toBe(initialCategory.id);
      expect(updatedCategory.description).toBe(initialCategory.description);
    });

    test("新しい名前が空（または空白のみ）の場合はエラーを投げる", () => {
      expect(() => categoryDomain.changeName(initialCategory, "")).toThrow("カテゴリ名は１文字以上にしてください");
      expect(() => categoryDomain.changeName(initialCategory, "  ")).toThrow("カテゴリ名は１文字以上にしてください");
    });

    test("新しい名前の前後から空白が削除される", () => {
      const updatedCategory = categoryDomain.changeName(initialCategory, "  New Name  ");
      expect(updatedCategory.name).toBe("New Name");
    });
  });

  describe("changeDescription", () => {
    const initialCategory: Category = {
      id: ulid(),
      name: "Name",
      description: "Old Description",
      parentId: null
    };

    test("説明を変更できる", () => {
      const updatedCategory = categoryDomain.changeDescription(initialCategory, "New Description");
      expect(updatedCategory.description).toBe("New Description");
      expect(updatedCategory.id).toBe(initialCategory.id);
      expect(updatedCategory.name).toBe(initialCategory.name);
    });

    test("新しい説明が空（または空白のみ）の場合はエラーを投げる", () => {
      expect(() => categoryDomain.changeDescription(initialCategory, "")).toThrow("カテゴリの説明は1文字以上にしてください");
      expect(() => categoryDomain.changeDescription(initialCategory, "  ")).toThrow("カテゴリの説明は1文字以上にしてください");
    });

    test("新しい説明の前後から空白が削除される", () => {
      const updatedCategory = categoryDomain.changeDescription(initialCategory, "  New Description  ");
      expect(updatedCategory.description).toBe("New Description");
    });
  });

  describe("changeParentCategory", () => {
    const initialCategory: Category = {
      id: ulid(),
      name: "Name",
      description: "Description",
      parentId: null
    };

    test("親カテゴリを変更できる", () => {
      const newParentId = ulid();
      const updatedCategory = categoryDomain.changeParentCategory(initialCategory, newParentId);
      expect(updatedCategory.parentId).toBe(newParentId);
      expect(updatedCategory.id).toBe(initialCategory.id);
    });

    test("不正な形式の親カテゴリIDの場合はエラーを投げる", () => {
      expect(() => categoryDomain.changeParentCategory(initialCategory, "invalid-id")).toThrow("不正な親カテゴリーです");
    });
  });
});
