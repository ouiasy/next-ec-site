import {ulid} from "ulid";

export type Payment = {
  readonly id: string;
  readonly orderId: string;
  readonly transactionId: string　| null; // paypalなどの決済履歴のID
  readonly method: PaymentMethod;
  readonly amount: number;
  readonly currency: "JPY"; // 今はJPYだけ
  readonly status: PaymentStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export type PaymentMethod = "paypal" | "stripe" | "cod";

type CreatePaymentInput = Pick<Payment,
  "orderId" | "method" | "amount"
>

const VALID_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["succeeded", "failed"],
  succeeded: ["refunded"],
  failed: [],
  refunded: [],
};


export const paymentDomain = {
  create: (input: CreatePaymentInput): Payment => {
    // if (input.amount <= 0)
    //   throw new Error("支払い金額は0より大きい必要があります")
    // if (!Number.isSafeInteger(input.amount))
    //   throw new Error("支払い金額は整数値にしてください")


    const now = new Date()
    return {
      id: ulid(),
      orderId: input.orderId,
      transactionId: null,
      method: input.method,
      amount: input.amount,
      currency: "JPY",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    }
  },

  changeStatus: (payment: Payment, status: PaymentStatus): Payment => {
    if (!VALID_PAYMENT_TRANSITIONS[payment.status].includes(status))
      throw new Error(`不正なステータスの遷移です: from:${payment.status} to:${status}`)

    const now = new Date()
    return {
      ...payment,
      status,
      updatedAt: now,
    }
  },

  // todo: not implemented
  insertTransactionId: (payment: Payment, transactionId: string): Payment => {
    throw new Error("not implemented")
    return {
      ...payment,
      transactionId,
    }
  }
}


interface PaymentRepository = {
  save: (payment: Payment) => Promise<void>,

}