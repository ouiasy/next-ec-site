import { index, integer, real, pgTable, text, boolean, timestamp, AnyPgColumn } from "drizzle-orm/pg-core";

export const productTable = pgTable("products", {
  id: text()
    .primaryKey(),
  name: text().notNull(),
  categoryId: text()
    .references(() => categoryTable.id, { onDelete: "set null" }),
  description: text().notNull(),
  priceBeforeTax: integer().notNull(),
  taxRatePercentage: integer().notNull(),
  priceAfterTax: integer().notNull(),
  brandId: text()
    .references(() => brandTable.id, {onDelete: "set null"}),
  rating: real(),
  numReviews: integer(),
  stock: integer().notNull(),
  isFeatured: boolean().default(false),
  createdAt: timestamp({ withTimezone: true })
    .notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull(),
});

export const productImageTable =
  pgTable("product_images", {
    id: text().primaryKey(),
    productId: text()
      .notNull()
      .references(() => productTable.id, { onDelete: "cascade" }),

    url: text().notNull(),
    imageName: text(),
    displayOrder: integer(), // todo: prodでnot nullに設定(seed用に外す)

    createdAt: timestamp({ withTimezone: true })
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull(),
  }, (table) => [
    index("product_id_idx").on(table.productId)
  ])

export const categoryTable =
  pgTable("categories", {
    id: text().primaryKey(),
    name: text().notNull().unique(),
    slug: text().notNull().unique(),
    parentId: text() // rootはnull
      .references((): AnyPgColumn => categoryTable.id, { onDelete: "cascade" }),
    description: text(),
  })

export const brandTable =
  pgTable("brands", {
    id: text().primaryKey(),
    name: text().notNull().unique(),
    slug: text().notNull().unique(),
    description: text(),
  })