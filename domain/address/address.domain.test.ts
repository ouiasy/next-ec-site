import { describe, expect, test, vi } from "vitest";
import { addressDomain } from "./address.domain";
import { updateUser } from "better-auth/api";
import { updateTag } from "next/cache";
import { ulid } from "ulid";

describe("address domain", () => {
  describe("create", () => {
    test("address オブジェクトが正しく作成されること", () => {
      const input = {
        userId: ulid(),
        lastName: "山田",
        firstName: "太郎",
        postalCode: "1234567",
        prefecture: "東京都",
        city: "新宿区",
        street: "西新宿1-1-1",
        building: "ビル1F",
        isDefault: true,
      } as const;

      const address = addressDomain.create(input)._unsafeUnwrap();

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
        userId: ulid(),
        lastName: "山田",
        firstName: "太郎",
        postalCode: "1234567",
        prefecture: "東京都",
        city: "新宿区",
        street: "西新宿1-1-1",
        building: null,
        isDefault: false,
      } as const;

      const address = addressDomain.create(input)._unsafeUnwrap();

      expect(address.building).toBeNull();
    });

    test("userIdが不正な場合はエラー", () => {
      const input = {
        userId: "invalid-user-id",
        lastName: "山田",
        firstName: "太郎",
        postalCode: "1234567",
        prefecture: "東京都",
        city: "新宿区",
        street: "西新宿1-1-1",
        building: "ビル1F",
        isDefault: true,
      } as const;

      const address = addressDomain.create(input);

      expect(address.isErr()).toBe(true);
    });

    test("postalCodeが不正な場合はエラー", () => {
      const input = {
        userId: ulid(),
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

      expect(address.isErr()).toBe(true);
    });

    test("prefectureが不正な場合はエラー", () => {
      const input = {
        userId: ulid(),
        lastName: "山田",
        firstName: "太郎",
        postalCode: "1234567",
        prefecture: "東京都ん",
        city: "新宿区",
        street: "西新宿1-1-1",
        building: "ビル1F",
        isDefault: true,
      } as const;

      const address = addressDomain.create(input);

      expect(address.isErr()).toBe(true);
    });

    test("cityが不正な場合はエラー", () => {
      const input = {
        userId: ulid(),
        lastName: "山田",
        firstName: "太郎",
        postalCode: "1234567",
        prefecture: "東京都",
        city: "",
        street: "西新宿1-1-1",
        building: "ビル1F",
        isDefault: true,
      } as const;

      const address = addressDomain.create(input);

      expect(address.isErr()).toBe(true);
    });

    test("streetが不正な場合はエラー", () => {
      const input = {
        userId: ulid(),
        lastName: "山田",
        firstName: "太郎",
        postalCode: "1234567",
        prefecture: "東京都",
        city: "新宿区",
        street: "",
        building: "ビル1F",
        isDefault: true,
      } as const;

      const address = addressDomain.create(input);

      expect(address.isErr()).toBe(true);
    });
  });

  describe("update", () => {
    test("addressが正しく更新されること", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01"));
      const input = {
        userId: ulid(),
        lastName: "山田",
        firstName: "太郎",
        postalCode: "1234567",
        prefecture: "東京都",
        city: "新宿区",
        street: "西新宿1-1-1",
        building: "ビル1F",
        isDefault: true,
      } as const;

      const address = addressDomain.create(input)._unsafeUnwrap();

      vi.advanceTimersByTime(1000);
      const update = {
        lastName: "山元",
        firstName: "二郎",
        postalCode: "9999999",
        prefecture: "大阪府",
        city: "市町村",
        street: "ストリート",
        building: null,
        isDefault: false,
      } as const;

      const newAddress = addressDomain.update(address, update)._unsafeUnwrap();

      expect(newAddress.id).toBe(address.id);
      expect(newAddress.userId).toBe(address.userId);
      expect(newAddress.lastName).toBe(update.lastName);
      expect(newAddress.firstName).toBe(update.firstName);
      expect(newAddress.postalCode).toBe(update.postalCode);
      expect(newAddress.prefecture).toBe(update.prefecture);
      expect(newAddress.city).toBe(update.city);
      expect(newAddress.street).toBe(update.street);
      expect(newAddress.building).toBe(update.building);
      expect(newAddress.isDefault).toBe(update.isDefault);
      expect(newAddress.createdAt).toBe(address.createdAt);
      expect(newAddress.updatedAt.getTime()).toBeGreaterThan(address.updatedAt.getTime());
    });
  });
});
