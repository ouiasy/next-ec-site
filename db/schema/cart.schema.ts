import { users } from "@/db/schema/user.schema";
import { productTable } from "@/db/schema/product.schema";
import { ulid } from "ulid";
import { index, integer, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";


export const cartTable = pgTable("carts", {
  id: text()
    .primaryKey()
    .$defaultFn(() => ulid()),
  userId: text().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("cart_user_id_idx").on(table.userId)
]);

export const cartItemTable = pgTable(
  "cart_items",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => ulid()),
    cartId: text()
      .notNull()
      .references(() => cartTable.id, { onDelete: "cascade" }),
    productId: text()
      .notNull()
      .references(() => productTable.id, { onDelete: "cascade" }),
    quantity: integer().notNull(),
    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
      unique().on(table.cartId, table.productId),
      index("cart_items_product_id_index").on(table.productId)
  ],
);

