import { defineRelations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { productTable } from "@/db/schema/product.schema";
import { users } from "@/db/schema/user.schema";
import { PREFECTURES } from "@/zod/dataset/prefecture";

export const orderTable = pgTable("orders", {
	id: text().primaryKey(),
	userId: text()
		.references(() => users.id, { onDelete: "set null" }),
	customerName: text().notNull(),
	email: text().notNull(),

	itemsSubtotal: integer().notNull(),
	taxTotal: integer().notNull(),
	shippingFee: integer().notNull(),
	couponId: text(),
	discount: integer().notNull(),
	shippingDiscount: integer().notNull(),
	grandTotal: integer().notNull(),
	
	orderStatus: text({ enum: ["pending", "paid", "completed", "cancelled"] })
		.default("pending")
		.notNull(),

	createdAt: timestamp({ withTimezone: true }).notNull(),
	updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
	index("order_user_id_idx").on(table.userId),
]);

export const orderItemsTable = pgTable("order_items", {
	id: text().primaryKey(),

	orderId: text()
		.notNull()
		.references(() => orderTable.id),
	productId: text()
		.notNull()
		.references(() => productTable.id),

	name: text().notNull(),
	priceBeforeTax: integer().notNull(),
	taxRate: integer().notNull(),
	quantity: integer().notNull(),
	createdAt: timestamp({ withTimezone: true }).notNull(),

}, (table) => [
	index("order_items_order_id_idx").on(table.orderId),
	index("order_items_product_id_idx").on(table.productId),
]);

export const shippingAddrTable = pgTable("shipping_addresses", {
	id: text().primaryKey(),
	orderId: text()
		.notNull()
		.unique()
		.references(() => orderTable.id),
	name: text().notNull(),
	postalCode: text().notNull(),
	prefecture: text({ enum: PREFECTURES }).notNull(),
	city: text().notNull(),
	street: text().notNull(),
	building: text(),
	createdAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
	index("shipping_addr_order_id_idx").on(table.orderId),
]);

export const billingAddrTable = pgTable("billing_addresses", {
	id: text().primaryKey(),
	orderId: text()
		.notNull()
		.unique()
		.references(() => orderTable.id),
	name: text().notNull(),
	postalCode: text().notNull(),
	prefecture: text({ enum: PREFECTURES }).notNull(),
	city: text().notNull(),
	street: text().notNull(),
	building: text(),
	createdAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
	index("billing_addr_order_id_idx").on(table.orderId),
]);

export const shipmentTable = pgTable("shipments", {
	id: text().primaryKey(),
	userId: text()
		.notNull()
		.references(() => users.id),
	orderId: text()
		.notNull()
		// .unique()  // 分割配送対応のため
		.references(() => orderTable.id),

	trackingId: text(),
	carrier: text(),
	status: text({
		enum: [
			"preparing", // 準備中
			"shipped", // 発送済み
			"in_transit", // 配送中（任意）
			"delivered", // 配達完了
			"returned", // 返送
			"lost", // 紛失
		],
	}).notNull(),

	shippedAt: timestamp({ withTimezone: true }),
	createdAt: timestamp({ withTimezone: true }).notNull(),
	updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
	index("shipment_order_id_idx").on(table.orderId),
]);

export const paymentTable = pgTable("payments", {
	id: text().primaryKey(),
	userId: text()
		.notNull()
		.references(() => users.id),
	orderId: text()
		.notNull()
		.references(() => orderTable.id),

	transactionId: text().notNull(), // paypal, stripeなどの決済id

	method: text({ enum: ["paypal", "stripe", "cash_on_delivery"] }).notNull(),

	amount: integer().notNull(),
	currency: text({ enum: ["JPY"] }).notNull(),

	status: text({
		enum: [
			"pending", // 支払い待ち
			"succeeded", // 成功
			"failed", // 失敗
			"refunded", // 返金済み
		],
	})
		.default("pending")
		.notNull(),

	createdAt: timestamp({ withTimezone: true }).notNull(),
	updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
	index("payment_order_id_idx").on(table.orderId),
	index("payment_user_id_idx").on(table.userId),
]);

const relations = defineRelations({orderTable, orderItemsTable, })