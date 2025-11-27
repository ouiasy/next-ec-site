import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {nanoid} from "nanoid";
import {relations, sql} from "drizzle-orm";
import {users} from "@/db/schema/user.schema";
import {products} from "@/db/schema/product.schema";


export const carts = sqliteTable("carts", {
  id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
  userId: text().references(() => users.id, {onDelete: "cascade"}),
  createdAt: integer("created_at", {mode: "timestamp_ms"})
      .notNull()
      .default(sql`(unixepoch())`),
  updatedAt: integer("created_at", {mode: "timestamp_ms"})
      .notNull()
      .default(sql`(unixepoch())`),
})

export const cartItems = sqliteTable("cart_items", {
  id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
  cartId: text()
      .notNull()
      .references(() => carts.id, {onDelete: "cascade"}),
  productId: text()
      .notNull()
      .references(() => products.id, {onDelete: "cascade"}),
  quantity: integer().notNull(),
  addedAt: integer()
      .notNull()
      .default(sql`(unixepoch())`),
})


export const cartsRelations = relations(carts, ({one, many}) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  cartItems: many(cartItems)
}))

export const cartItemsRelations = relations(cartItems, ({one}) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}))