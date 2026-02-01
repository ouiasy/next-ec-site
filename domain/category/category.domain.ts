import { Result, err, ok } from "neverthrow";
import { isValid, ulid } from "ulid";
import { CategoryDomainError, CategoryIdMismatchError, EmptyValueError, InvalidParentIdError } from "./category.domain.errors";

export type Category = {
	readonly id: string;
	readonly name: string;
	readonly description: string | null;
	readonly parentId: string | null;

	readonly createdAt: Date;
	readonly updatedAt: Date;
};

export type CreateCategoryInput = Omit<Category, "id" | "updatedAt" | "createdAt">;
export type UpdateCategoryInput = Omit<Category, "id" | "updatedAt" | "createdAt">;

export const categoryDomain = {
	/**
	 * 新たなカテゴリを作成する
	 * @param name カテゴリ名
	 * @param description カテゴリの説明
	 * @param parentId 親カテゴリID
	 * @returns 作成されたカテゴリ
	 */
	create: (input: CreateCategoryInput): Result<Category, CategoryDomainError> => {
		const trimmedName = input.name.trim();
		if (trimmedName.length === 0) {
			return err(new EmptyValueError("名前は1文字以上にしてください"));
		}
		const trimmedDescription = input.description?.trim();
		if (trimmedDescription !== undefined && trimmedDescription.length === 0) {
			return err(new EmptyValueError("説明は1文字以上にしてください"));
		}
		if (input.parentId && !isValid(input.parentId)) {
			return err(new InvalidParentIdError("不正な親カテゴリです"));
		}
		const now = new Date();
		return ok({
			id: ulid(),
			name: trimmedName,
			description: trimmedDescription ?? null,
			parentId: input.parentId ?? null,
			createdAt: now,
			updatedAt: now,
		});
	},

	/**
	 * 既存のカテゴリを更新する
	 * @param original 更新前のカテゴリ
	 * @param update 更新内容
	 * @returns 更新後のカテゴリ
	 */
	update: (original: Category, update: UpdateCategoryInput): Result<Category, CategoryDomainError> => {
		const trimmedName = update.name.trim();
		if (trimmedName.length === 0) {
			return err(new EmptyValueError("名前は1文字以上にしてください"));
		}
		const trimmedDescription = update.description?.trim();
		if (trimmedDescription !== undefined && trimmedDescription.length === 0) {
			return err(new EmptyValueError("説明は1文字以上にしてください"));
		}

		if (update.parentId && !isValid(update.parentId)) {
			return err(new InvalidParentIdError("不正な親カテゴリです"));
		}

		const now = new Date();
		return ok({
			...original,
			name: trimmedName,
			description: trimmedDescription ?? null,
			parentId: update.parentId ?? null,
			updatedAt: now,
		});
	}
};

export interface CategoryRepository {
	getCategoryById: (categoryId: string) => Promise<Category | null>;
	getCategoriesByIDs: (ids: string[]) => Promise<Category[]>;
	save: (category: Category) => Promise<void>;
}
