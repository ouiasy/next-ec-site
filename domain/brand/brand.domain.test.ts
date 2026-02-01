import { describe, expect, test } from "vitest";
import { brandDomain, Brand, CreateBrandInput } from "./brand.domain";
import { createTestBrand } from "@/.testutils/factories/factories";
import { UpdateBrandInput } from "./brand.domain";

describe("brandDomain", () => {
  describe("create", () => {
    test("有効な名前と説明でブランドを作成できる", () => {
      const input: CreateBrandInput = {
        name: "ブランド名",
        description: "ブランドの説明",
      }
      const brand = brandDomain.create(input)._unsafeUnwrap();

      expect(brand.id).toBeDefined();
      expect(brand.name).toBe(input.name);
      expect(brand.description).toBe(input.description);
    });

    test("名前が空（または空白のみ）の場合はエラーを投げる", () => {
      const input: CreateBrandInput = {
        name: " ",
        description: "description",
      }
      const brand = brandDomain.create(input);
      expect(brand.isErr()).toBe(true);
    });

    test("説明が空（または空白のみ）の場合はエラーを投げる", () => {
      const input: CreateBrandInput = {
        name: "name",
        description: " ",
      }
      const brand = brandDomain.create(input);
      expect(brand.isErr()).toBe(true);
    });

    test("説明がnullの場合には許容する", () => {
      const input: CreateBrandInput = {
        name: "name",
        description: null,
      }
      const brand = brandDomain.create(input)._unsafeUnwrap();
      expect(brand.description).toBeNull();
    });


    test("名前と説明の前後から空白が削除される", () => {
      const input: CreateBrandInput = {
        name: "  Brand  ",
        description: "  Description  ",
      }
      const brand = brandDomain.create(input)._unsafeUnwrap();
      expect(brand.name).toBe("Brand");
      expect(brand.description).toBe("Description");
    });
  });

  describe("update", () => {
    test("正常にブランド情報がupdateされる", () => {
      const brand = createTestBrand();
      const updatedBrand: UpdateBrandInput = {
        name: "updated Name",
        description: "updated description",
      };
      const res = brandDomain.update(brand, updatedBrand)._unsafeUnwrap();
      expect(res.id).toBe(brand.id);
      expect(res.name).toBe(updatedBrand.name);
      expect(res.description).toBe(updatedBrand.description);
    });

    test("名前が空（または空白のみ）の場合はエラーを投げる", () => {
      const brand = createTestBrand();
      const updatedBrand: UpdateBrandInput = {
        name: " ",
        description: "updated description",
      };
      const res = brandDomain.update(brand, updatedBrand);
      expect(res.isErr()).toBe(true);
    });

    test("説明が空（または空白のみ）の場合はエラーを投げる", () => {
      const brand = createTestBrand();
      const updatedBrand: UpdateBrandInput = {
        name: "name",
        description: " ",
      };
      const res = brandDomain.update(brand, updatedBrand);
      expect(res.isErr()).toBe(true);
    });

    test("説明がnullの場合には許容する", () => {
      const brand = createTestBrand();
      const updatedBrand: UpdateBrandInput = {
        name: "name",
        description: null,
      };
      const res = brandDomain.update(brand, updatedBrand)._unsafeUnwrap();
      expect(res.description).toBeNull();
    });
  });
});
