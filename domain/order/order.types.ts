export type Order = {
  readonly id: string;
  readonly userId: string;
  readonly itemsSubtotal: number;
  readonly taxTotal: number;
  readonly shippingFee: number;
  readonly grandTotal: number;
  readonly orderStatus: OrderStatus;
  readonly orderItems: OrderItems[];
  readonly shippingAddress: Address | null;
  readonly billingAddress: Address | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

type OrderStatus = "pending" | "paid" | "completed" | "cancelled";

type OrderItems = {
  readonly id: string;
  readonly productId: string;
  readonly productName: string;
  readonly priceExTax: number;
  readonly taxRate: number;
  readonly quantity: number;
}

export type Address = {
  readonly name: string;
  readonly postalCode: string;
  readonly prefecture: string;
  readonly city: string;
  readonly street: string;
  readonly building: string | null;
}

export type CreateOrderInput = {
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    priceExTax: number;
    taxRate: number;
    quantity: number;
  }>;
}