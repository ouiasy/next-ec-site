import { beforeEach, describe, expect, test, vi } from "vitest";
import { categoryDomain, Category, UpdateCategoryInput, CreateCategoryInput } from "./category.domain";
import { ulid } from "ulid";

describe("categoryDomain", () => {
  describe("create", () => {
    test("有効な名前と説明でカテゴリを作成できる", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2022-01-01"));
      const input: CreateCategoryInput = {
        name: "カテゴリ名",
        description: "カテゴリの説明",
        parentId: null,
      }
      const category = categoryDomain.create(input)._unsafeUnwrap();

      expect(category.id).toBeDefined();
      expect(category.name).toBe(input.name);
      expect(category.description).toBe(input.description);
      expect(category.parentId).toBeNull();
      expect(category.createdAt).toEqual(new Date("2022-01-01"));
      expect(category.updatedAt).toEqual(new Date("2022-01-01"));
    });

    test("親カテゴリIDを指定してカテゴリを作成できる", () => {
      const input: CreateCategoryInput = {
        name: "カテゴリ名",
        description: "カテゴリの説明",
        parentId: ulid(),
      }
      const category = categoryDomain.create(input)._unsafeUnwrap();

      expect(category.parentId).toBe(input.parentId);
    });

    test("名前が空（または空白のみ）の場合はエラーを投げる", () => {
      const input1: CreateCategoryInput = {
        name: "",
        description: "説明",
        parentId: null,
      }
      const input2: CreateCategoryInput = {
        name: "   ",
        description: "説明",
        parentId: null,
      }
      const cat1 = categoryDomain.create(input1);
      const cat2 = categoryDomain.create(input2);
      expect(cat1.isErr()).toBe(true);
      expect(cat2.isErr()).toBe(true);
    });

    test("説明が空（または空白のみ）の場合はエラーを投げる", () => {
      const input1: CreateCategoryInput = {
        name: "名前",
        description: "",
        parentId: null,
      }
      const input2: CreateCategoryInput = {
        name: "名前",
        description: "   ",
        parentId: null,
      }
      const cat1 = categoryDomain.create(input1);
      const cat2 = categoryDomain.create(input2);
      expect(cat1.isErr()).toBe(true);
      expect(cat2.isErr()).toBe(true);
    });

    test("説明がnullの場合には許容する", () => {
      const input: CreateCategoryInput = {
        name: "名前",
        description: null,
        parentId: null,
      }
      const category = categoryDomain.create(input)._unsafeUnwrap();
      expect(category.description).toBeNull();
    })

    test("不正な形式の親カテゴリIDの場合はエラーを投げる", () => {
      const input: CreateCategoryInput = {
        name: "名前",
        description: "説明",
        parentId: "invalid-id",
      }
      const cat1 = categoryDomain.create(input);
      expect(cat1.isErr()).toBe(true);
    });

    test("名前と説明の前後から空白が削除される", () => {
      const input: CreateCategoryInput = {
        name: "  Category  ",
        description: "  Description  ",
        parentId: null,
      }
      const cat1 = categoryDomain.create(input)._unsafeUnwrap();
      expect(cat1.name).toBe("Category");
      expect(cat1.description).toBe("Description");
    });
  });

  describe("update", () => {
    const testDate = new Date("2022-01-01");
    vi.useFakeTimers();
    vi.setSystemTime(testDate);
    const initialCategory: Category = {
      id: ulid(),
      name: "Old Name",
      description: "Description",
      parentId: null,
      createdAt: testDate,
      updatedAt: testDate,
    };
    beforeEach(() => {
      vi.advanceTimersByTime(1000);
    });

    test("カテゴリを更新できる", () => {
      const updateData: UpdateCategoryInput = {
        name: "New Name",
        description: "New Description",
        parentId: ulid(),
      };
      const updatedCategory = categoryDomain.update(initialCategory, updateData)._unsafeUnwrap();
      expect(updatedCategory.name).toBe(updateData.name);
      expect(updatedCategory.description).toBe(updateData.description);
      expect(updatedCategory.id).toBe(initialCategory.id);
      expect(updatedCategory.createdAt).toEqual(initialCategory.createdAt);
      expect(updatedCategory.updatedAt).greaterThan(initialCategory.updatedAt)
    });


    test("新しい名前が空（または空白のみ）の場合はエラーを投げる", () => {
      const updateData: UpdateCategoryInput = {
        name: "  ",
        description: "New Description",
        parentId: ulid(),
      }
      const updatedCategory = categoryDomain.update(initialCategory, updateData);
      expect(updatedCategory.isErr()).toBe(true);
    });

    test("新しい説明が空（または空白のみ）でも許容する", () => {
      const updateData: UpdateCategoryInput = {
        name: "New Name",
        description: "  ",
        parentId: ulid(),
      }
      const updatedCategory = categoryDomain.update(initialCategory, updateData);
      expect(updatedCategory.isErr()).toBe(false);
    });


    test("新しい親カテゴリIDが不正な形式の場合はエラーを投げる", () => {
      const updateData: UpdateCategoryInput = {
        name: "New Name",
        description: "New Description",
        parentId: "invalid-id",
      }
      const updatedCategory = categoryDomain.update(initialCategory, updateData);
      expect(updatedCategory.isErr()).toBe(true);
    });
  });


});
