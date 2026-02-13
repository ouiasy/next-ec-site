import "server-only";
import { DB } from "@/db";
import { Shipment, ShipmentRepository } from "@/domain/shipment/shipment.domain";
import { shipmentTable } from "@/db/schema/order.schema";
import { ULID } from "ulid";
import { err, ok, Result } from "neverthrow";
import { RepositoryError } from "@/domain/repository.error";
import { eq } from "drizzle-orm";


export type RawShipmentSelect = typeof shipmentTable.$inferSelect;
export type RawShipmentInsert = typeof shipmentTable.$inferInsert;

const fromRawShipment = (rawShipment: RawShipmentSelect): Shipment => {
  return {
    id: rawShipment.id,
    userId: rawShipment.userId,
    orderId: rawShipment.orderId,

    carrier: rawShipment.carrier,
    status: rawShipment.status,
    trackingId: rawShipment.trackingId,

    shippedAt: rawShipment.shippedAt,
    createdAt: rawShipment.createdAt,
    updatedAt: rawShipment.updatedAt,
  }
}

const toRawShipment = (shipment: Shipment): RawShipmentInsert => {
  return {
    id: shipment.id,
    userId: shipment.userId,
    orderId: shipment.orderId,

    carrier: shipment.carrier,
    status: shipment.status,
    trackingId: shipment.trackingId,

    shippedAt: shipment.shippedAt,
    createdAt: shipment.createdAt,
    updatedAt: shipment.updatedAt,
  }
}

export const createShipmentRepository = (db: DB): ShipmentRepository => {
  return {
    getShipmentByOrderId: async (orderId: ULID): Promise<Result<Shipment[], RepositoryError>> => {
      try {
        const rawShipments = await db
          .select().from(shipmentTable)
          .where(eq(shipmentTable.orderId, orderId));
        const shipments = rawShipments.map(fromRawShipment);
        return ok(shipments)
      } catch (e) {
        return err(new RepositoryError("注文に紐づけられた配送情報の取得に失敗しました", { cause: e }));
      }
    },
    save: async (shipment: Shipment): Promise<Result<Shipment, RepositoryError>> => {
      try {
        const rawShipment = toRawShipment(shipment);
        const [updatedRawShipment] = await db.insert(shipmentTable)
          .values(rawShipment)
          .onConflictDoUpdate({
            target: shipmentTable.id,
            set: {
              ...rawShipment
            }
          }).returning();
        if (updatedRawShipment !== undefined) {
          throw new Error("配送情報の更新後のデータの取得に失敗")
        }
        return ok(fromRawShipment(updatedRawShipment));
      } catch (e) {
        return err(new RepositoryError("配送情報の更新に失敗しました", { cause: e }))
      }
    }
  }
}