import { defineRelations } from "drizzle-orm";
import { billingAddrTable, orderItemsTable, orderTable, shippingAddrTable } from "./order.schema";
import { productImageTable, productTable } from "./product.schema";

export const orderRelations = defineRelations({
	orderTable,
	orderItemsTable,
	shippingAddrTable,
	billingAddrTable
}, (r) => ({
	orderTable: {
		items: r.many.orderItemsTable({
			from: r.orderTable.id,
			to: r.orderItemsTable.orderId
		}),
		shippingAddr: r.one.shippingAddrTable({
			from: r.orderTable.id,
			to: r.shippingAddrTable.orderId,
		}),
		billingAddr: r.one.shippingAddrTable({
			from: r.orderTable.id,
			to: r.billingAddrTable.orderId,
		})
	},
}))


export const productRelations = defineRelations({
	productTable,
	productImageTable,
}, (r) => ({
	productTable: {
		images: r.many.productImageTable({
			from: r.productTable.id,
			to: r.productImageTable.productId,
		})
	}
}))