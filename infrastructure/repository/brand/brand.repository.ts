import { eq, inArray } from "drizzle-orm";
import { DB } from "@/db";
import { brandTable } from "@/db/schema/product.schema";
import { Brand, BrandRepository } from "@/domain/brand/brand.domain";

export const createBrandRepository = (db: DB): BrandRepository => ({
	getBrandById: async (brandId: string): Promise<Brand | null> => {
		const brand = await db
			.select()
			.from(brandTable)
			.where(eq(brandTable.id, brandId))
			.limit(1);

		if (brand.length === 0) return null;

		return brand[0];
	},

	getBrandsByIDs: (ids: string[]): Promise<Brand[]> => {
		if (ids.length === 0) return [];
		return db.select().from(brandTable).where(inArray(brandTable.id, ids));
	},

	save: (brand: Brand): Promise<void> => {
		throw new Error("not implemented");
	},
});
