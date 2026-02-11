import { eq, inArray } from "drizzle-orm";
import { DB } from "@/db";
import { brandTable } from "@/db/schema/product.schema";
import { Brand, BrandRepository } from "@/domain/brand/brand.domain";
import { Result, ok, err } from "neverthrow";
import { RepositoryError } from "@/domain/repository.error";

export const createBrandRepository = (db: DB): BrandRepository => ({
	getBrandById: async (brandId: string): Promise<Result<Brand | null, RepositoryError>> => {
		try {
			const brand = await db
				.select()
				.from(brandTable)
				.where(eq(brandTable.id, brandId))
				.limit(1);

			if (brand.length === 0) return ok(null);

			return ok(brand[0]);
		} catch (e) {
			console.error("error at BrandRepository [getBrandById]: ", e);
			return err(new RepositoryError("ブランド情報の取得に失敗"));
		}
	},

	getBrandsByIDs: async (ids: string[]): Promise<Result<Brand[], RepositoryError>> => {
		try {
			if (ids.length === 0) return ok([]);
			const res = await db.select().from(brandTable).where(inArray(brandTable.id, ids));
			return ok(res);
		} catch (e) {
			console.error("error at BrandRepository [getBrandsByIDs]: ", e);
			return err(new RepositoryError("複数のブランド情報の取得に失敗"));
		}
	},

	save: async (brand: Brand): Promise<Result<Brand, RepositoryError>> => {
		try {
			const res = await db.insert(brandTable).values(brand).onConflictDoUpdate({
				target: brandTable.id,
				set: {
					...brand,
					updatedAt: new Date(),
				}
			}).returning();
			return ok(res[0]);
		} catch (e) {
			console.error("error at BrandRepository [save]: ", e);
			return err(new RepositoryError("ブランド情報の保存に失敗"));
		}
	},
});
