import { Result, err, ok } from "neverthrow";
import { isValid, ulid } from "ulid";
import { CategoryDomainError, CategoryIdMismatchError, EmptyValueError, InvalidParentIdError } from "./category.domain.errors";

export type Category = {
	id: string;
	name: string;
	description: string | null;
	parentId: string | null;
};

export const categoryDomain = {
	create: (name: string, description: string | null, parentId: string | null): Result<Category, CategoryDomainError> => {
		const trimmedName = name.trim();
		if (trimmedName.length === 0) {
			return err(new EmptyValueError("名前は1文字以上にしてください"));
		}
		const trimmedDescription = description?.trim();
		if (trimmedDescription && trimmedDescription.length === 0) {
			return err(new EmptyValueError("説明は1文字以上にしてください"));
		}
		if (parentId && !isValid(parentId)) {
			return err(new InvalidParentIdError("不正な親カテゴリです"));
		}
		return ok({
			id: ulid(),
			name: trimmedName,
			description: trimmedDescription ?? null,
			parentId: parentId ?? null,
		});
	},

	update: (original: Category, update: Category): Result<Category, CategoryDomainError> => {
		if (original.id !== update.id) {
			return err(new CategoryIdMismatchError("更新対象のカテゴリIDが一致しません"));
		}
		const trimmedName = update.name.trim();
		if (trimmedName.length === 0) {
			return err(new EmptyValueError("名前は1文字以上にしてください"));
		}
		const trimmedDescription = update.description?.trim();

		if (update.parentId && !isValid(update.parentId)) {
			return err(new InvalidParentIdError("不正な親カテゴリです"));
		}
		return ok({
			...original,
			name: trimmedName,
			description: trimmedDescription ?? null,
			parentId: update.parentId ?? null,
		});
	}
};

export interface CategoryRepository {
	getCategoryById: (categoryId: string) => Promise<Category | null>;
	getCategoriesByIDs: (ids: string[]) => Promise<Category[]>;
	save: (category: Category) => Promise<void>;
}
