import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {nanoid} from "nanoid";
import {sql} from "drizzle-orm";
import {users} from "@/db/schema/users";
import {products} from "@/db/schema/product";


export const carts = sqliteTable("carts", {
  id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
  userId: text().notNull().references(() => users.id, {onDelete: "cascade"}),
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