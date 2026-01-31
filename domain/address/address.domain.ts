import { err, ok, Result } from "neverthrow";
import { isValid, ULID, ulid } from "ulid";
import { PREFECTURES } from "@/zod/dataset/prefecture";
import { AddressDomainError, EmptyFieldError, InvalidPostalCodeError, InvalidUserIdError } from "./address.domain.error";

type Prefecture = (typeof PREFECTURES)[number];

export type Address = {
	readonly id: ULID;
	readonly userId: ULID;

	readonly lastName: string;
	readonly firstName: string;

	readonly postalCode: string;
	readonly prefecture: Prefecture;
	readonly city: string;
	readonly street: string;
	readonly building: string | null;

	readonly isDefault: boolean;

	readonly updatedAt: Date;
	readonly createdAt: Date;
};

type CreateAddressInput = Omit<Address, "id" | "updatedAt" | "createdAt">;

export const addressDomain = {
	/**
	 * 新たにaddressエンティティを作成する
	 * @param input
	 * @returns
	 */
	create: (input: CreateAddressInput): Result<Address, AddressDomainError> => {
		if (!isValid(input.userId)) {
			return err(new InvalidUserIdError("無効なユーザーIDです"));
		}

		if (!/^\d{7}$/.test(input.postalCode)) {
			return err(
				new InvalidPostalCodeError("郵便番号は7桁の数字で入力してください"),
			);
		}

		if (input.lastName.trim().length === 0) {
			return err(new EmptyFieldError("姓を入力してください"));
		}

		const now = new Date();
		return ok({
			id: ulid(),
			...input,
			createdAt: now,
			updatedAt: now,
		});
	},

	/**
	 * addressエンティティの更新をする
	 * @param address
	 * @param input
	 * @returns
	 */
	update: (address: Address, input: CreateAddressInput): Address => {
		return {
			...address,
			userId: input.userId,
			lastName: input.lastName,
			firstName: input.firstName,
			postalCode: input.postalCode,
			prefecture: input.prefecture,
			city: input.city,
			street: input.street,
			building: input.building,
			isDefault: input.isDefault,
			updatedAt: new Date(),
		};
	},
};
