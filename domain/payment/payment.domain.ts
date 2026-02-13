import {isValid, ULID, ulid} from "ulid";
import { InvalidAmountError, InvalidMethodError, InvalidOrderIdError, InvalidStatusError, InvalidTransactionIdError, PaymentDomainError } from "./payment.domain.error";
import { Result, ok, err } from "neverthrow";
import { RepositoryError } from "../repository.error";

export type Payment = {
  readonly id: ULID;

  readonly userId: ULID;
  readonly orderId: ULID;
  readonly transactionId: string; // paypalなどの決済履歴のID
  readonly method: PaymentMethod;
  readonly amount: number;
  readonly currency: "JPY"; // 今はJPYだけ
  readonly status: PaymentStatus;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const PAYMENT_STATUS = ["pending", "succeeded", "failed", "refunded"] as const
export type PaymentStatus = typeof PAYMENT_STATUS[number]

export const PAYMENT_METHODS = ["paypal", "stripe"] as const
export type PaymentMethod = typeof PAYMENT_METHODS[number]

export type CreatePaymentInput = Omit<Payment,
  "id" | "currency" | "createdAt" | "updatedAt"
>

const VALID_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["succeeded", "failed"],
  succeeded: ["refunded"],
  failed: [],
  refunded: [],
};


export const paymentDomain = {
  create: (input: CreatePaymentInput): Result<Payment, PaymentDomainError> => {
    if (!isValid(input.orderId))
      return err(new InvalidOrderIdError("無効な注文IDです"))

    const trimmedTransactionId = input.transactionId.trim()
    if (trimmedTransactionId.length === 0)
      return err(new InvalidTransactionIdError("トランザクションIDは空であってはなりません"))

    if (!PAYMENT_METHODS.includes(input.method))
      return err(new InvalidMethodError("無効な支払い方法です"))

    if (input.amount <= 0) 
      return err(new InvalidAmountError("支払い金額は0より大きい必要があります"))
    if (!Number.isSafeInteger(input.amount)) 
      return err(new InvalidAmountError("支払い金額は整数値にしてください"))

    if (!PAYMENT_STATUS.includes(input.status))
      return err(new InvalidStatusError("無効なステータスです"))


    const now = new Date()
    return ok({
      id: ulid(),
      userId: input.userId,
      orderId: input.orderId,
      transactionId: input.transactionId,
      method: input.method,
      amount: input.amount,
      currency: "JPY",
      status: input.status,
      createdAt: now,
      updatedAt: now,
    })
  },

  /**
   * 支払いステータスを変更する
   * @param payment 変更前の支払い情報
   * @param status 変更後のステータス
   * @returns 
   */
  changeStatus: (payment: Payment, status: PaymentStatus): Result<Payment, PaymentDomainError> => {
    if (!VALID_PAYMENT_TRANSITIONS[payment.status].includes(status))
      return err(new InvalidStatusError(`不正なステータスの遷移です: from:${payment.status} to:${status}`))

    const now = new Date()
    return ok({
      ...payment,
      status,
      updatedAt: now,
    })
  },
}


export interface PaymentRepository {
  /**
   * 新しい支払いを作成あるいは既存の支払い方法を保存する
   * @param payment 作成する支払い情報
   * @returns 
   */
  save: (payment: Payment) => Promise<Result<Payment, RepositoryError>>;

  /**
   * orderIDに紐付けられた支払い情報(複数の可能性あり)を取得する。作成日時に関して降順で出力する。
   * @param orderId 
   * @returns 
   */
  getPaymentsByOrderId: (orderId: ULID) => Promise<Result<Payment[], RepositoryError>>;
  /**
   * userIDに紐付けられた支払い情報(複数あり)の取得。作成日時に関して降順で出力する。
   * @param userId 
   * @returns 
   */
  getPaymentsByUserId: (userId: ULID) => Promise<Result<Payment[], RepositoryError>>;
}