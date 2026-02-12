import {isValid, ULID, ulid} from "ulid";
import { InvalidIdError, InvalidShipmentStatusError, InvalidValueError, ShipmentDomainError } from "./shipment.domain.errors";
import { Result, err, ok } from "neverthrow";
import { RepositoryError } from "@/domain/repository.error";


export type Shipment = {
  readonly id: ULID;
  readonly userId: ULID;
  readonly orderId: ULID;
  readonly trackingId: string | null;
  readonly carrier: string | null;

  readonly status: ShipmentStatus;

  readonly shippedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type ShipmentStatus = "preparing"| "shipped"| "in_transit"| "delivered"| "returned"| "lost"

const VALID_SHIPMENT_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  preparing: ["shipped", "lost"],
  shipped: ["in_transit", "lost"],
  in_transit: ["delivered", "lost"],
  delivered: ["returned", "lost"],
  returned: [],
  lost: [],
}

type CreateShipmentInput = Pick<Shipment,
  "orderId" | "userId" 
>

type UpdateShipmentInput = Pick<Shipment,
  "trackingId" | "carrier" | "status"
>

export const shipmentDomain = {
  /**
   * 配送エンティティを生成する
   * @param input 
   * @returns 
   */
  create: (input: CreateShipmentInput): Result<Shipment, ShipmentDomainError> => {
    if(!isValid(input.userId)) {
      return err(new InvalidIdError("無効なユーザーIDです"))
    }
    if (!isValid(input.orderId)) {
      return err(new InvalidIdError("無効なオーダーIDです"))
    }
    const now = new Date()
    return ok({
      id: ulid(),
      userId: input.userId,
      orderId: input.orderId,
      trackingId: null,
      carrier: null,
      status: "preparing",
      shippedAt: null,
      createdAt: now,
      updatedAt: now,
    })
  },

  /**
   * 配送エンティティの状態を更新する
   * @param shipment 
   * @param status 
   * @returns 
   */
  updateStatus: (shipment: Shipment, update: UpdateShipmentInput): Result<Shipment, ShipmentDomainError> => {
    const trimmedCarrier = update.carrier?.trim()
    if (trimmedCarrier !== undefined && trimmedCarrier.length === 0) {
      return err(new InvalidValueError("無効なキャリア名です"))
    }
    const trimmedTrackingId = update.trackingId?.trim()
    if (trimmedTrackingId !== undefined && trimmedTrackingId.length === 0) {
      return err(new InvalidValueError("無効なトラッキングIDです"))
    }
    if (!VALID_SHIPMENT_TRANSITIONS[shipment.status].includes(update.status)) {
      return err(new InvalidShipmentStatusError("無効な配送状態です"))
    }

    const now = new Date();
    const shippedAt = update.status === "shipped" && shipment.status === "preparing" ? now : shipment.shippedAt;
    return ok({
      ...shipment,
      trackingId: trimmedTrackingId ?? null,
      carrier: trimmedCarrier ?? null,
      status: update.status,
      shippedAt,
      updatedAt: now,
    })
  },
}


export interface ShipmentRepository {
  getShipmentByOrderId: (orderId: ULID) => Promise<Result<Shipment[], RepositoryError>>
  save: (shipment: Shipment) => Promise<Result<Shipment, RepositoryError>>;
}