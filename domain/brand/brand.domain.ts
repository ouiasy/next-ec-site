import { Result, ok, err } from "neverthrow";
import { ulid } from "ulid";
import { BrandDomainError, EmptyValueError } from "./brand.domain.errors";

export type Brand = {
	readonly id: string;
	readonly name: string;
	readonly description: string | null;
};

export type UpdateBrandInput = {
	name?: string;
	description?: string;
};

export const brandDomain = {
	/**
	 * ブランド情報を追加する
	 * @param name ブランド名
	 * @param description 詳細説明
	 * @returns ブランド情報
	 */
	create: (name: string, description?: string): Result<Brand, BrandDomainError> => {
		const trimmedName = name.trim();
		if (trimmedName.length === 0) {
			return err(new EmptyValueError("ブランド名は1文字以上にしてください"));
		}
		return ok({
			id: ulid(),
			name: trimmedName,
			description: description?.trim() ?? null,
		});
	},

	/**
	 * ブランド名を変更する
	 * @param brand ブランド情報
	 * @param name 新しいブランド名
	 * @returns ブランド情報
	 */
	update: (brand: Brand, update: UpdateBrandInput): Result<Brand, BrandDomainError> => {
		if (update.name) {
			const trimmedName = update.name.trim();
			if (trimmedName.length === 0) {
				return err(new EmptyValueError("ブランド名は1文字以上にしてください"));
			}
		}

		return ok({
			...brand,
			name: update.name?.trim() ?? brand.name,
			description: update.description?.trim() ?? brand.description,
		});
	},
};

export interface BrandRepository {
	getBrandById: (brandId: string) => Promise<Brand | null>;
	getBrandsByIDs: (ids: string[]) => Promise<Brand[]>;
	save: (brand: Brand) => Promise<void>;
}
