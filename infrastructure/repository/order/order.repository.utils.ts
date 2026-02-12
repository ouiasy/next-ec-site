import "server-only";

import { addressTable } from "@/db/schema/address.schema";
import { billingAddrTable, orderItemsTable, orderTable, shippingAddrTable } from "@/db/schema/order.schema";
import { Order, OrderAddress, OrderItems } from "@/domain/order/order.types";
import { OrderApplicationContextLandingPage } from "@paypal/paypal-server-sdk";
import { Item } from "@radix-ui/react-dropdown-menu";

export type RawOrderSelect = typeof orderTable.$inferSelect;
export type RawOrderInsert = typeof orderTable.$inferInsert;

export type RawOrderItemSelect = typeof orderItemsTable.$inferSelect;
export type RawOrderItemInsert = typeof orderItemsTable.$inferInsert;

export type RawShippingAddrSelect = typeof shippingAddrTable.$inferSelect;
export type RawShippingAddrInsert = typeof shippingAddrTable.$inferInsert;

export type RawBillingAddrSelect = typeof billingAddrTable.$inferSelect;
export type RawBillingAddrInsert = typeof billingAddrTable.$inferInsert;

export const toRawOrderComposite = (order: Order): {
    rawOrder: RawOrderInsert,
    rawOrderItems: RawOrderItemInsert[],
    rawShippingAddr: RawShippingAddrInsert,
    rawBillingAddr: RawBillingAddrInsert,
} => {
    const rawOrder: RawOrderInsert = {
        id: order.id,
        email: order.email,
        userId: order.userId,
        couponId: order.couponId,

        customerName: order.customerName,
        itemsSubtotal: order.itemsSubtotal,
        taxTotal: order.taxTotal,
        shippingFee: order.shippingFee,
        discount: order.discount,
        shippingDiscount: order.shippingDiscount,
        grandTotal: order.grandTotal,

        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    }

    const rawOrderItems: RawOrderItemInsert[] = order.items.map((item): RawOrderItemInsert => ({
        id: item.id,
        name: item.name,

        orderId: order.id,
        priceBeforeTax: item.priceBeforeTax,
        taxRate: item.taxRate,
        productId: item.productId,
        quantity: item.quantity,

        createdAt: item.createdAt,
    }))

    const rawShippingAddr: RawShippingAddrInsert = {
        id: order.shippingAddress.id,
        name: order.shippingAddress.name,
        orderId: order.id,
        postalCode: order.shippingAddress.postalCode,
        prefecture: order.shippingAddress.prefecture,
        city: order.shippingAddress.city,
        street: order.shippingAddress.street,
        building: order.shippingAddress.building,
        createdAt: order.shippingAddress.createdAt
    }

    const rawBillingAddr: RawBillingAddrInsert = {
        id: order.billingAddress.id,
        name: order.billingAddress.name,
        orderId: order.id,
        postalCode: order.billingAddress.postalCode,
        prefecture: order.billingAddress.prefecture,
        city: order.billingAddress.city,
        street: order.billingAddress.street,
        building: order.billingAddress.building,
        createdAt: order.billingAddress.createdAt
    }

    return {
        rawOrder,
        rawOrderItems,
        rawShippingAddr,
        rawBillingAddr
    }
}

export type RawOrderCompositeSelect = RawOrderSelect & {
    items: RawOrderItemSelect[],
    shippingAddr: RawShippingAddrSelect | null,
    billingAddr: RawBillingAddrSelect | null,
}


export const fromRawOrderComposite = (
    res: RawOrderCompositeSelect
): Order => {
    const items = res.items.map((item): OrderItems => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        priceBeforeTax: item.priceBeforeTax,
        taxRate: item.taxRate,
        quantity: item.quantity,
        createdAt: item.createdAt,
    }))

    const shippingAddr: OrderAddress = res.shipping_addresses;
    const billinAddr: OrderAddress = res.billingAddress;

    return {
        id: res.id,
        userId: res.userId,
        customerName: res.customerName,
        email: res.email,
        itemsSubtotal: res.itemsSubtotal,
        couponId: res.couponId,
        shippingFee: res.shippingFee,
        shippingDiscount: res.shippingDiscount,
        discount: res.discount,
        taxTotal: res.taxTotal,
        grandTotal: res.grandTotal,
        orderStatus: res.orderStatus,
        items: items,
        shippingAddress: shippingAddr,
        billingAddress: billinAddr,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
    }
}