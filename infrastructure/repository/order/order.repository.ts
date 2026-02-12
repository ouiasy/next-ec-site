import "server-only";

import { DB } from "@/db"
import { eq } from "drizzle-orm";
import { OrderRepository } from "@/domain/order/order.domain"
import { Order } from "@/domain/order/order.types"
import { RepositoryError } from "@/domain/repository.error"
import { err, Result } from "neverthrow"
import { ULID } from "ulid"
import { billingAddrTable, orderItemsTable, orderTable, shippingAddrTable } from "@/db/schema/order.schema";
import { fromRawOrderComposite } from "./order.repository.utils";


export const createOrderRepository = (db: DB): OrderRepository => {
    return {
        getOrderById: async (orderId: ULID): Promise<Result<Order, RepositoryError>> => {
            try {
                const rawOrder = await db
                    .select()
                    .from(orderTable)
                    .where(eq(orderTable.id, orderId))
                    .innerJoin(orderItemsTable, eq(orderTable.id, orderItemsTable.orderId))
                    .innerJoin(shippingAddrTable, eq(orderTable.id, shippingAddrTable.orderId))
                    .innerJoin(billingAddrTable, eq(orderTable.id, billingAddrTable.orderId));

                if (rawOrder.length !== 1) 
                    throw new Error("該当のorderが見つかりませんでした")

                const order = rawOrder.map(fromRawOrderComposite)
            } catch (e) {
                return err(new RepositoryError("オーダーの検索に失敗", {cause: e}))
            }
        },
        getOrdersByUserId: function (userId: ULID): Promise<Result<Order[], RepositoryError>> {
            throw new Error("Function not implemented.")
        },
        save: function (order: Order): Promise<Result<Order, RepositoryError>> {
            throw new Error("Function not implemented.")
        }
    }
}