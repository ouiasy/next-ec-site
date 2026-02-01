import { describe, expect, test } from "vitest";
import { categoryDomain, Category } from "./category.domain";
import { ulid } from "ulid";

describe("categoryDomain", () => {
  describe("create", () => {
    test("有効な名前と説明でカテゴリを作成できる", () => {
      const name = "カテゴリ名";
      const description = "カテゴリの説明";
      const category = categoryDomain.create(name, description, null)._unsafeUnwrap();

      expect(category.id).toBeDefined();
      expect(category.name).toBe(name);
      expect(category.description).toBe(description);
      expect(category.parentId).toBeNull();
    });

    test("親カテゴリIDを指定してカテゴリを作成できる", () => {
      const name = "カテゴリ名";
      const description = "カテゴリの説明";
      const parentId = ulid();
      const category = categoryDomain.create(name, description, parentId)._unsafeUnwrap();

      expect(category.parentId).toBe(parentId);
    });

    test("名前が空（または空白のみ）の場合はエラーを投げる", () => {
      const cat1 = categoryDomain.create("", "説明", null);
      const cat2 = categoryDomain.create("   ", "説明", null);
      expect(cat1.isErr()).toBe(true);
      expect(cat2.isErr()).toBe(true);
    });

    test("説明が空（または空白のみ）でも許容する", () => {
      const cat1 = categoryDomain.create("名前", "", null);
      const cat2 = categoryDomain.create("名前", "   ", null);
      expect(cat1.isErr()).toBe(false);
      expect(cat2.isErr()).toBe(false);
    });

    test("不正な形式の親カテゴリIDの場合はエラーを投げる", () => {
      const cat1 = categoryDomain.create("名前", "説明", "invalid-id");
      expect(cat1.isErr()).toBe(true);
    });

    test("名前と説明の前後から空白が削除される", () => {
      const cat1 = categoryDomain.create("  Category  ", "  Description  ", null)._unsafeUnwrap();
      expect(cat1.name).toBe("Category");
      expect(cat1.description).toBe("Description");
    });
  });

  describe("update", () => {
    const initialCategory: Category = {
      id: ulid(),
      name: "Old Name",
      description: "Description",
      parentId: null
    };

    test("カテゴリを更新できる", () => {
      const updateData = categoryDomain.create("New Name", "New Description", ulid())._unsafeUnwrap();
      updateData.id = initialCategory.id;
      const updatedCategory = categoryDomain.update(initialCategory, updateData)._unsafeUnwrap();
      expect(updatedCategory.name).toBe(updateData.name);
      expect(updatedCategory.description).toBe(updateData.description);
      expect(updatedCategory.id).toBe(initialCategory.id);
    });

    test("カテゴリidがマッチしない場合にはエラーを返す", () => {
      const updateData = categoryDomain.create("New Name", "New Description", ulid())._unsafeUnwrap();
      const updatedCategory = categoryDomain.update(initialCategory, updateData);
      expect(updatedCategory.isErr()).toBe(true);
    })

    test("新しい名前が空（または空白のみ）の場合はエラーを投げる", () => {
      const updateData = categoryDomain.create("  ", "New Description", ulid());
      expect(updateData.isErr()).toBe(true);
    });

    test("新しい説明が空（または空白のみ）でも許容する", () => {
      const updateData = categoryDomain.create("New Name", "  ", ulid());
      expect(updateData.isErr()).toBe(false);
    });


    test("新しい親カテゴリIDが不正な形式の場合はエラーを投げる", () => {
      const updateData = categoryDomain.create("New Name", "New Description", "invalid-id");
      expect(updateData.isErr()).toBe(true);
    });
  });


});
