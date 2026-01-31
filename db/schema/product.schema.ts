import {
	AnyPgColumn,
	boolean,
	index,
	integer,
	pgTable,
	real,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const productTable = pgTable("products", {
	id: text().primaryKey(),
	name: text().notNull(),
	categoryId: text().references(() => categoryTable.id, {
		onDelete: "set null",
	}),
	description: text().notNull(),
	priceBeforeTax: integer().notNull(),
	taxRate: integer().notNull(),
	brandId: text().references(() => brandTable.id, { onDelete: "set null" }),
	rating: real(),
	numReviews: integer().notNull().default(0),
	stock: integer().notNull(),
	isFeatured: boolean().notNull().default(false),
	createdAt: timestamp({ withTimezone: true }).notNull(),
	updatedAt: timestamp({ withTimezone: true }).notNull(),
});

export const productImageTable = pgTable(
	"product_images",
	{
		id: text().primaryKey(),
		productId: text()
			.notNull()
			.references(() => productTable.id, { onDelete: "cascade" }),

		url: text().notNull(),
		imageName: text(),
		displayOrd: integer().notNull(),

		createdAt: timestamp({ withTimezone: true }).notNull(),
		updatedAt: timestamp({ withTimezone: true }).notNull(),
	},
	(table) => [index("product_id_idx").on(table.productId)],
);

export const categoryTable = pgTable("categories", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	parentId: text() // rootはnull
		.references((): AnyPgColumn => categoryTable.id, { onDelete: "cascade" }),
	description: text(),
});

export const brandTable = pgTable("brands", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	description: text(),
});
