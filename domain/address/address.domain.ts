import { err, ok, Result } from "neverthrow";
import { isValid, ULID, ulid } from "ulid";
import { PREFECTURES } from "@/zod/dataset/prefecture";
import { AddressDomainError, EmptyFieldError, InvalidPostalCodeError, InvalidPrefectureError, InvalidUserIdError } from "./address.domain.error";
import { RepositoryError } from "../repository.error";

export type Prefecture = (typeof PREFECTURES)[number];

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
type UpdateAddressInput = Omit<Address, "id" | "userId" | "updatedAt" | "createdAt">;

export const addressDomain = {
	/**
	 * 新たにaddressエンティティを作成する
	 * @param input 作成するaddress
	 * @returns 作成したaddress
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

		if (!PREFECTURES.includes(input.prefecture)) {
			return err(new InvalidPrefectureError("無効な都道府県です"));
		}

		const safeLastName = input.lastName.trim();
		if (safeLastName.length === 0) {
			return err(new EmptyFieldError("姓を入力してください"));
		}

		const safeFirstName = input.firstName.trim();
		if (safeFirstName.length === 0) {
			return err(new EmptyFieldError("名を入力してください"));
		}

		const safeCity = input.city.trim();
		if (safeCity.length === 0) {
			return err(new EmptyFieldError("市区町村を入力してください"));
		}

		const safeStreet = input.street.trim();
		if (safeStreet.length === 0) {
			return err(new EmptyFieldError("番地を入力してください"));
		}

		const now = new Date();
		return ok({
			id: ulid(),
			...input,
			lastName: safeLastName,
			firstName: safeFirstName,
			city: safeCity,
			street: safeStreet,
			createdAt: now,
			updatedAt: now,
		});
	},


	/**
	 * addressエンティティの更新をする
	 * @param address 更新前のaddress
	 * @param input 更新するaddress情報
	 * @returns 更新後のaddress
	 */
	update: (address: Address, input: UpdateAddressInput): Result<Address, AddressDomainError> => {
		if (!/^\d{7}$/.test(input.postalCode)) {
			return err(
				new InvalidPostalCodeError("郵便番号は7桁の数字で入力してください"),
			);
		}

		if (!PREFECTURES.includes(input.prefecture)) {
			return err(new InvalidPrefectureError("無効な都道府県です"));
		}

		const safeLastName = input.lastName.trim();
		if (safeLastName.length === 0) {
			return err(new EmptyFieldError("姓を入力してください"));
		}

		const safeFirstName = input.firstName.trim();
		if (safeFirstName.length === 0) {
			return err(new EmptyFieldError("名を入力してください"));
		}

		const safeCity = input.city.trim();
		if (safeCity.length === 0) {
			return err(new EmptyFieldError("市区町村を入力してください"));
		}

		const safeStreet = input.street.trim();
		if (safeStreet.length === 0) {
			return err(new EmptyFieldError("番地を入力してください"));
		}

		return ok({
			...address,
			lastName: input.lastName,
			firstName: input.firstName,
			postalCode: input.postalCode,
			prefecture: input.prefecture,
			city: input.city,
			street: input.street,
			building: input.building,
			isDefault: input.isDefault,
			updatedAt: new Date(),
		});
	},
};

export interface AddressRepository {
	getAddrByUserId: (userId: ULID) => Promise<Result<Address[], RepositoryError>>;
	save: (addr: Address) => Promise<Result<Address, RepositoryError>>;
}