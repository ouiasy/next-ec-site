import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { relations, sql } from "drizzle-orm";
import { users } from "@/db/schema/user.schema";
import { productTable } from "@/db/schema/product.schema";


export const cartTable = sqliteTable("carts", {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const cartItemTable = sqliteTable(
  "cart_items",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    cartId: text()
      .notNull()
      .references(() => cartTable.id, { onDelete: "cascade" }),
    productId: text()
      .notNull()
      .references(() => productTable.id, { onDelete: "cascade" }),
    quantity: integer().notNull(),
    addedAt: integer()
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [unique().on(table.cartId, table.productId)],
);

export const cartsRelations = relations(cartTable, ({ one, many }) => ({
  user: one(users, {
    fields: [cartTable.userId],
    references: [users.id],
  }),
  cartItems: many(cartItemTable),
}));

export const cartItemsRelations = relations(cartItemTable, ({ one }) => ({
  cart: one(cartTable, {
    fields: [cartItemTable.cartId],
    references: [cartTable.id],
  }),
  product: one(productTable, {
    fields: [cartItemTable.productId],
    references: [productTable.id],
  }),
}));
