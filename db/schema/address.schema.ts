import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { ulid } from "ulid";

export const addressTable =
  pgTable("addresses", {
    id: text()
      .primaryKey()
      .$defaultFn(() => ulid()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
    postalCode: text().notNull(),
    prefecture: text().notNull(),
    city: text().notNull(),
    street: text().notNull(),
    building: text(),
    isDefault: boolean().notNull().default(false),
    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }, (table) => [
    index("address_user_id_idx").on(table.userId)
  ]);


