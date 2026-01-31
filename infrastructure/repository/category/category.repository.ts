import { eq, inArray } from "drizzle-orm";
import { DB } from "@/db";
import { categoryTable } from "@/db/schema/product.schema";
import {
	Category,
	CategoryRepository,
} from "@/domain/category/category.domain";

export const createCategoryRepository = (db: DB): CategoryRepository => ({
	getCategoryById: async (categoryId: string): Promise<Category | null> => {
		const category = await db
			.select()
			.from(categoryTable)
			.where(eq(categoryTable.id, categoryId))
			.limit(1);
		if (category.length === 0) return null;
		return category[0];
	},

	getCategoriesByIDs: async (ids: string[]): Promise<Category[]> => {
		if (ids.length === 0) return [];
		return db
			.select()
			.from(categoryTable)
			.where(inArray(categoryTable.id, ids));
	},

	save: (Category: Category): Promise<void> => {
		throw new Error("not implemented");
	},
});
