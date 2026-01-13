import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const addressTable =
  pgTable("addresses", {
    id: text()
      .primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lastName: text().notNull(),
    firstName: text().notNull(),
    postalCode: text().notNull(),
    prefecture: text().notNull(),
    city: text().notNull(),
    street: text().notNull(),
    building: text(),
    isDefault: boolean().notNull().default(false),
    createdAt: timestamp({ withTimezone: true })
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull(),
  }, (table) => [
    index("address_user_id_idx").on(table.userId)
  ]);


