import "server-only";

import { DB } from "@/db"
import { eq, inArray } from "drizzle-orm";
import { OrderRepository } from "@/domain/order/order.domain"
import { Order } from "@/domain/order/order.types"
import { RepositoryError } from "@/domain/repository.error"
import { err, Result, ok } from "neverthrow"
import { ULID } from "ulid"
import { billingAddrTable, orderItemsTable, orderTable, shippingAddrTable } from "@/db/schema/order.schema";
import { fromRawOrderComposite, toRawOrderComposite } from "./order.repository.utils";


export const createOrderRepository = (db: DB): OrderRepository => {
    return {
        getOrderById: async (orderId: ULID): Promise<Result<Order | null, RepositoryError>> => {
            try {
                const rawOrder = await db.query.orderTable
                    .findFirst({
                        with: {
                            items: true,
                            shippingAddr: true,
                            billingAddr: true,
                        },
                        where: {
                            id: orderId,
                        }
                    })
                if (rawOrder === undefined) {
                    return ok(null)
                }

                const order = fromRawOrderComposite(rawOrder)
                return ok(order);
            } catch (e) {
                return err(new RepositoryError("注文履歴の検索に失敗", { cause: e }))
            }
        },
        getOrdersByUserId: async (userId: ULID): Promise<Result<Order[], RepositoryError>> => {
            try {
                const rawOrders = await db.query.orderTable
                    .findMany({
                        with: {
                            items: true,
                            shippingAddr: true,
                            billingAddr: true,
                        },
                        where: {
                            userId: userId,
                        }
                    })
                const orders = rawOrders.map(fromRawOrderComposite);
                return ok(orders);
            } catch (e) {
                return err(new RepositoryError("注文履歴の検索に失敗", { cause: e }))
            }
        },
        save: async (order: Order): Promise<Result<Order, RepositoryError>> => {
            try {
                const { rawOrder, rawOrderItems,
                    rawShippingAddr, rawBillingAddr } = toRawOrderComposite(order);

                const rawUpdatedOrder = await db.transaction(async (tx) => {
                    await tx.insert(orderTable).values(rawOrder).onConflictDoUpdate({
                        target: orderTable.id,
                        set: {
                            ...rawOrder,
                        }
                    })

                    await Promise.all([
                        tx.insert(shippingAddrTable).values(rawShippingAddr).onConflictDoUpdate({
                            target: shippingAddrTable.id,
                            set: {
                                ...rawShippingAddr,
                            }
                        }),
                        tx.insert(billingAddrTable).values(rawBillingAddr).onConflictDoUpdate({
                            target: billingAddrTable.id,
                            set: {
                                ...rawBillingAddr,
                            }
                        }),
                    ])

                    await tx.delete(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));

                    if (rawOrderItems.length > 0) {
                        await tx.insert(orderItemsTable).values(rawOrderItems);
                    }

                    const rawUpdatedOrder = await tx.query.orderTable.findFirst({
                        with: {
                            items: true,
                            shippingAddr: true,
                            billingAddr: true,
                        },
                        where: {
                            id: order.id,
                        },
                    })

                    if (rawUpdatedOrder === undefined)
                        throw new Error("注文情報が消失しました");

                    return rawUpdatedOrder
                })
                return ok(fromRawOrderComposite(rawUpdatedOrder))
            } catch (e) {
                return err(new RepositoryError("注文情報の更新に失敗", { cause: e }))
            }
        }
    }
}