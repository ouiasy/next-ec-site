import { Result, ok, err } from "neverthrow";
import { ulid } from "ulid";
import { BrandDomainError, EmptyValueError } from "./brand.domain.errors";
import { RepositoryError } from "../repository.error";

export type Brand = {
	readonly id: string;
	readonly name: string;
	readonly description: string | null;

	readonly createdAt: Date;
	readonly updatedAt: Date;
};

export type CreateBrandInput = Omit<Brand, "id" | "updatedAt" | "createdAt">;
export type UpdateBrandInput = Omit<Brand, "id" | "updatedAt" | "createdAt">;

export const brandDomain = {
	/**
	 * ブランド情報を追加する
	 * @param name ブランド名
	 * @param description 詳細説明
	 * @returns ブランド情報
	 */
	create: (input: CreateBrandInput): Result<Brand, BrandDomainError> => {
		const trimmedName = input.name.trim();
		if (trimmedName.length === 0) {
			return err(new EmptyValueError("ブランド名は1文字以上にしてください"));
		}

		const trimmedDescription = input.description?.trim();
		if (trimmedDescription !== undefined && trimmedDescription.length === 0) {
			return err(new EmptyValueError("ブランド説明は1文字以上にしてください"));
		}

		const now = new Date();
		return ok({
			id: ulid(),
			name: trimmedName,
			description: trimmedDescription ?? null,
			createdAt: now,
			updatedAt: now,
		});
	},

	/**
	 * ブランド名を変更する
	 * @param brand ブランド情報
	 * @param name 新しいブランド名
	 * @returns ブランド情報
	 */
	update: (brand: Brand, update: UpdateBrandInput): Result<Brand, BrandDomainError> => {
		const trimmedName = update.name.trim();
		if (trimmedName.length === 0) {
			return err(new EmptyValueError("ブランド名は1文字以上にしてください"));
		}

		const trimmedDescription = update.description?.trim();
		if (trimmedDescription !== undefined && trimmedDescription.length === 0) {
			return err(new EmptyValueError("ブランド説明は1文字以上にしてください"));
		}

		const now = new Date();

		return ok({
			...brand,
			name: trimmedName,
			description: trimmedDescription ?? null,
			updatedAt: now,
		});
	},
};

export interface BrandRepository {
	getBrandById: (brandId: string) => Promise<Result<Brand | null, RepositoryError>>;
	getBrandsByIDs: (ids: string[]) => Promise<Result<Brand[], RepositoryError>>;
	save: (brand: Brand) => Promise<Result<Brand, RepositoryError>>;
}
