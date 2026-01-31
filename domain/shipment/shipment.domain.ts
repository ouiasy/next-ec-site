import {ulid} from "ulid";

export type Shipment = {
  readonly id: string;
  readonly orderId: string;
  readonly trackingId: string | null;
  readonly carrier: string | null;

  readonly status: ShipmentStatus;

  readonly shippedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type ShipmentStatus = "preparing" | "shipped" | "in_transit" | "delivered" | "returned" | "lost";

const VALID_SHIPMENT_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  preparing: ["shipped", "lost"],
  shipped: ["in_transit", "lost"],
  in_transit: ["delivered", "lost"],
  delivered: ["returned", "lost"],
  returned: [],
  lost: [],
}

type CreateShipmentInput = Pick<Shipment,
  "orderId"
>

export const shipmentDomain = {
  create:　(input: CreateShipmentInput): Shipment => {
    const now = new Date()
    return {
      id: ulid(),
      orderId: input.orderId,
      trackingId: null,
      carrier: null,
      status: "preparing",

      shippedAt: null,
      createdAt: now,
      updatedAt: now,
    }
  }
}
