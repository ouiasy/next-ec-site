import { eq, inArray } from "drizzle-orm";
import { DB } from "@/db";
import { brandTable } from "@/db/schema/product.schema";
import { Brand, BrandRepository } from "@/domain/brand/brand.domain";
import { Result, ok, err } from "neverthrow";
import { RepositoryError } from "@/domain/repository.error";
import { ULID } from "ulid";

type RawBrandSelect = typeof brandTable.$inferSelect;
type RawBrandInsert = typeof brandTable.$inferInsert;

const fromBrandRaw = (brandRaw: RawBrandInsert): Brand => {
	return {
		id: brandRaw.id,
		name: brandRaw.name,
		description: brandRaw.description ?? null,

		createdAt: brandRaw.createdAt,
		updatedAt: brandRaw.updatedAt,
	}
}

const toBrandRaw = (brand: Brand): RawBrandSelect => {
	return {
		id: brand.id,
		name: brand.name,
		description: brand.description,

		createdAt: brand.createdAt,
		updatedAt: brand.updatedAt,
	}
}

export const createBrandRepository = (db: DB): BrandRepository => {
	return {
		getBrandById: async (brandId: string): Promise<Result<Brand | null, RepositoryError>> => {
			try {
				const res = await db
					.select()
					.from(brandTable)
					.where(eq(brandTable.id, brandId))
					.limit(1);

				if (res.length === 0) return ok(null);

				const brand = res.map(fromBrandRaw);
				return ok(brand[0]);
			} catch (e) {
				return err(new RepositoryError("ブランド情報の取得に失敗", { cause: e }));
			}
		},

		getBrandsByIDs: async (ids: ULID[]): Promise<Result<Brand[], RepositoryError>> => {
			try {
				if (ids.length === 0) return ok([]);
				const res = await db.select()
					.from(brandTable)
					.where(inArray(brandTable.id, ids));
				const brands = res.map(fromBrandRaw);
				return ok(brands);
			} catch (e) {
				return err(new RepositoryError("複数のブランド情報の取得に失敗", { cause: e }));
			}
		},

		save: async (brand: Brand): Promise<Result<Brand, RepositoryError>> => {
			try {
				const rawBrand = toBrandRaw(brand);
				const res = await db.insert(brandTable).values(rawBrand).onConflictDoUpdate({
					target: brandTable.id,
					set: {
						name: brand.name,
						description: brand.description,

						updatedAt: new Date(),
					}
				}).returning();
				if (res.length === 0) {
					return err(new RepositoryError("ブランド情報の保存に失敗しました"));
				}
				const resBrands = res.map(fromBrandRaw);
				return ok(resBrands[0]);
			} catch (e) {
				return err(new RepositoryError("ブランド情報の保存に失敗", { cause: e }));
			}
		},
	}
};
