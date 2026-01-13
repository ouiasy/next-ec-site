import {ulid} from "ulid";
import {CreateOrderInput, Order, Address} from "@/domain/order/order.types";


export const orderDomain = {
  create: (input: CreateOrderInput): Order => {
    const now = new Date()

    const orderItems = input.items.map(item => ({
      ...item,
      id: ulid(),
    }))

    const itemsSubtotal = orderItems.reduce((sum, item) =>
      sum + item.priceExTax * item.quantity, 0)

    const taxTotal = Math.floor(orderItems.reduce((sum, item) =>
      sum + item.priceExTax * item.quantity * item.taxRate, 0)/100)

    const shippingFee = calculateShippingFee(itemsSubtotal + taxTotal)

    const grandTotal = itemsSubtotal + taxTotal + shippingFee

    return {
      id: ulid(),
      userId: input.userId,
      orderItems,
      itemsSubtotal,
      taxTotal,
      shippingFee,
      grandTotal,
      orderStatus: "pending",
      shippingAddress: null,
      billingAddress: null,
      createdAt: now,
      updatedAt: now,
    }
  },

  insertShippingAddr: (order: Order, addr: Address): Order => {
    return {
      ...order,
      shippingAddress: addr
    }
  },

  insertBillingAddr: (order: Order, addr: Address): Order => {
    return {
      ...order,
      billingAddress: addr
    }
  }
}

const calculateShippingFee = (priceAfterTax: number): number => {
  if (priceAfterTax > 5_000) {
    return 0
  }
  return 500
}
