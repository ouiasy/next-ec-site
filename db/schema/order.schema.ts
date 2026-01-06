import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "@/db/schema/user.schema";
import { ulid } from "ulid";
import { productTable } from "@/db/schema/product.schema";
import { prefectures } from "@/zod/dataset/prefecture";

export const orderTable =
  pgTable("orders", {
    id: text()
      .primaryKey()
      .$defaultFn(() => ulid()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemsSubtotal: integer()
      .notNull(),
    taxTotal: integer()
      .notNull(),
    shippingFee: integer()
      .notNull(),
    grandTotal: integer()
      .notNull(),
    currency: text({ enum: ["JPY"] })
      .default("JPY")
      .notNull(), //日本円だけにする
    paymentStatus:
      text({ enum: ["pending", "paid", "failed", "refunded"] })
        .default("pending")
        .notNull(),
    shippingStatus:
      text({ enum: ["preparing", "shipped", "delivered", "returned"] })
        .default("preparing")
        .notNull(),
    orderStatus:
      text({ enum: ["open", "closed", "cancelled"] })
        .default("open")
        .notNull(),

    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  })


export const orderItems = pgTable("order_items", {
  id: text().primaryKey()
    .$defaultFn(() => ulid()),

  orderId: text().notNull()
    .references(() => orderTable.id),
  productId: text().notNull()
    .references(() => productTable.id),

  productName: text().notNull(),
  priceExTax: integer().notNull(),
  taxRate: integer().notNull(),
  quantity: integer().notNull(),
})

export const shippingAddrTable =
  pgTable("shipping_addresses", {
    id: text()
      .primaryKey()
      .$defaultFn(() => ulid()),
    orderId: text()
      .notNull()
      .unique()
      .references(() => orderTable.id),
    name: text().notNull(),
    postalCode: text().notNull(),
    prefecture: text({ enum: prefectures }).notNull(),
    city: text().notNull(),
    street: text().notNull(),
    building: text(),
  })

export const billingAddrTable =
  pgTable("billing_addresses", {
    id: text()
      .primaryKey()
      .$defaultFn(() => ulid()),
    orderId: text()
      .notNull()
      .unique()
      .references(() => orderTable.id),
    name: text().notNull(),
    postalCode: text().notNull(),
    prefecture: text({ enum: prefectures }).notNull(),
    city: text().notNull(),
    street: text().notNull(),
    building: text(),
  })

export const shipmentTable =
  pgTable("shipments", {
    id: text().primaryKey()
      .$defaultFn(() => ulid()),
    orderId: text()
      .notNull()
      // .unique()  // 分割配送対応のため
      .references(() => orderTable.id),

    trackingNum: text().notNull(),
    carrier: text({enum: [""]}).notNull(),
    shipped_at: timestamp({ withTimezone: true }),

    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  })

export const paymentTable = pgTable("payments", {
  id: text().primaryKey()
    .$defaultFn(() => ulid()),
  orderId: text()
    .notNull()
    .references(() => orderTable.id),

  transactionId: text(), // paypal, stripeなどの決済id

  method: text({enum: ["paypal", "stripe", "cash_on_delivery"]})
    .notNull(),

  amount: integer().notNull(),
  currency: text({enum: ["JPY"]}).notNull(),

  status: text({enum: ["pending", "succeeded", "failed", "refund"]})
    .default("pending"),

  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})