import { sql } from 'drizzle-orm';
import {sqliteTable, text, integer, real} from "drizzle-orm/sqlite-core";
import {nanoid} from "nanoid";


export const productTable = sqliteTable("product", {
    id: text().primaryKey().$defaultFn(() => nanoid()),
    name: text().notNull(),
    slug: text().notNull().unique(),
    category: text(),
    description: text(),
    images: text({mode: "json"}).$type<string[]>().default(sql`'[]'`),
    price: integer().notNull().default(0),
    brand: text(),
    rating: real().default(0),
    numReviews: integer().default(0),
    stock: integer(),
    isFeatured: integer({mode: "boolean"}).default(false),
    banner: text(),
    createdAt: integer("created_at", { mode: "timestamp_ms"}).notNull().default(sql`(unixepoch())`)
});