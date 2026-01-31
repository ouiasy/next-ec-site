import {describe, expect, test} from "vitest";
import {addressDomain} from "./address.domain";
import { updateUser } from "better-auth/api";
import { updateTag } from "next/cache";

describe("address domain", () => {
  describe("create", () => {
    test("address オブジェクトが正しく作成されること", () => {
      const input = {
        userId: "user_1",
        lastName: "山田",
        firstName: "太郎",
        postalCode: "123-4567",
        prefecture: "東京都",
        city: "新宿区",
        street: "西新宿1-1-1",
        building: "ビル1F",
        isDefault: true,
      } as const;

      const address = addressDomain.create(input);

      expect(address.id).toBeDefined();
      expect(address.userId).toBe(input.userId);
      expect(address.lastName).toBe(input.lastName);
      expect(address.firstName).toBe(input.firstName);
      expect(address.postalCode).toBe(input.postalCode);
      expect(address.prefecture).toBe(input.prefecture);
      expect(address.city).toBe(input.city);
      expect(address.street).toBe(input.street);
      expect(address.building).toBe(input.building);
      expect(address.isDefault).toBe(input.isDefault);
      expect(address.createdAt).toBeInstanceOf(Date);
      expect(address.updatedAt).toBeInstanceOf(Date);
      expect(address.createdAt).toEqual(address.updatedAt);
    });

    test("building が null の場合でも正しく作成されること", () => {
      const input = {
        userId: "user_1",
        lastName: "山田",
        firstName: "太郎",
        postalCode: "123-4567",
        prefecture: "東京都",
        city: "新宿区",
        street: "西新宿1-1-1",
        building: null,
        isDefault: false,
      } as const;

      const address = addressDomain.create(input);

      expect(address.building).toBeNull();
    });
  });

  describe("update", () => {
    test("addressが正しく更新されること", () => {
      const input = {
        userId: "user_1",
        lastName: "山田",
        firstName: "太郎",
        postalCode: "123-4567",
        prefecture: "東京都",
        city: "新宿区",
        street: "西新宿1-1-1",
        building: "ビル1F",
        isDefault: true,
      } as const;

      const address = addressDomain.create(input)._unsafeUnwrap();

      const update = {
        userId: "user_2",
        lastName: "山元",
        firstName: "二郎",
        postalCode: "999-9999",
        prefecture: "大阪府",
        city: "市町村",
        street: "ストリート",
        building: null,
        isDefault: false,
      } as const;

      const newAddress = addressDomain.update(address, update);

      expect(newAddress.id).toBe(address.id);
      expect(newAddress.userId).toBe(address.userId);
      expect(newAddress.lastName).toBe(update.lastName);
      expect(newAddress.firstName).toBe(update.firstName)
      expect(newAddress.postalCode).toBe()

    })
  })
});
