import { ulid } from "ulid";

export type Brand = {
	readonly id: string;
	readonly name: string;
	readonly description: string | null;
};

export const brandDomain = {
	create: (name: string, description: string): Brand => {
		const trimmedName = name.trim();
		if (trimmedName.length === 0) {
			throw new Error("ブランド名は1文字以上にしてください");
		}
		const trimmedDescription = description.trim();
		if (trimmedDescription.length === 0) {
			throw new Error("詳細説明は1文字以上入れてください");
		}
		return {
			id: ulid(),
			name: trimmedName,
			description: trimmedDescription,
		};
	},
};

export interface BrandRepository {
	getBrandById: (brandId: string) => Promise<Brand | null>;
	getBrandsByIDs: (ids: string[]) => Promise<Brand[]>;
	save: (brand: Brand) => Promise<void>;
}
