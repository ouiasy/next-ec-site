import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

export const addressTable = sqliteTable("addresses", {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text()
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  postalCode: text().notNull(),
  prefecture: text().notNull(),
  city: text().notNull(),
  street: text().notNull(),
  building: text(),
});

export const addressTableRelation = relations(addressTable, ({ one }) => ({
  user: one(users, {
    fields: [addressTable.userId],
    references: [users.id],
  }),
}));
