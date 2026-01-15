import {isValid, ulid} from "ulid";

import {PREFECTURES} from "@/zod/dataset/prefecture";

type Prefecture = typeof PREFECTURES[number]

export type Address = {
  readonly id: string;
  readonly userId: string;

  readonly lastName: string; // 苗字
  readonly firstName: string; // 名前

  readonly postalCode: string;
  readonly prefecture: Prefecture;
  readonly city: string;
  readonly street: string;
  readonly building: string | null;

  readonly isDefault: boolean;

  readonly updatedAt: Date;
  readonly createdAt: Date;
}


type CreateAddressInput = Omit<Address, "id" | "updatedAt" | "createdAt">

export const addressDomain = {
  create: (input: CreateAddressInput): Address => {
    const now = new Date();
    return {
      id: ulid(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };
  },


}