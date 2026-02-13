import "server-only";
import { eq, inArray } from "drizzle-orm";
import { DB } from "@/db";
import { categoryTable } from "@/db/schema/product.schema";
import {
	Category,
	CategoryRepository,
} from "@/domain/category/category.domain";
import { Result, err, ok } from "neverthrow";
import { RepositoryError } from "@/domain/repository.error";
import { ULID } from "ulid";
import { map } from "zod";

type RawCategorySelect = typeof categoryTable.$inferSelect;
type RawCategoryInsert = typeof categoryTable.$inferInsert;

const fromRawCategory = (rawCategory: RawCategorySelect): Category => {
	return {
		id: rawCategory.id,
		name: rawCategory.name,
		description: rawCategory.description,
		parentId: rawCategory.parentId,
		createdAt: rawCategory.createdAt,
		updatedAt: rawCategory.updatedAt
	}
}

const toRawCategory = (category: Category): RawCategoryInsert => {
	return {
		id: category.id,
		name: category.name,
		description: category.description,
		parentId: category.parentId,
		createdAt: category.createdAt,
		updatedAt: category.updatedAt
	}
}

export const createCategoryRepository = (db: DB): CategoryRepository => {
	return {
		getCategoryById: async (categoryId: ULID): Promise<Result<Category | null, RepositoryError>> => {
			try {
				const rawCategory = await db
					.select()
					.from(categoryTable)
					.where(eq(categoryTable.id, categoryId))
					.limit(1);
				if (rawCategory.length === 0) return ok(null);
				const category = fromRawCategory(rawCategory[0]);
				return ok(category);
			} catch (e) {
				return err(new RepositoryError("カテゴリーの取得に失敗", { cause: e }));
			}
		},

		getCategoriesByIDs: async (ids: ULID[]): Promise<Result<Category[], RepositoryError>> => {
			try {
				if (ids.length === 0) return ok([]);
				const rawCategories = await db
					.select()
					.from(categoryTable)
					.where(inArray(categoryTable.id, ids));
				const categories = rawCategories.map(fromRawCategory);
				return ok(categories);
			} catch (e) {
				return err(new RepositoryError("複数カテゴリの取得に失敗", { cause: e }));
			}
		},

		save: async (category: Category): Promise<Result<Category, RepositoryError>> => {
			try {
				const rawCategory = toRawCategory(category);
				const rawCategories = await db.insert(categoryTable)
					.values(rawCategory)
					.onConflictDoUpdate({
						target: categoryTable.id,
						set: {
							...rawCategory,
						}
					}).returning();
				const categories = rawCategories.map(fromRawCategory);
				if (categories.length !== 0) {
					return err(new RepositoryError("カテゴリの保存に失敗"));
				}
				return ok(categories[0]);
			} catch (e) {
				return err(new RepositoryError("カテゴリの保存に失敗", { cause: e }));
			}
		},
	}
};
