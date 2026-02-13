import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import {CreatePaymentInput, paymentDomain, type Payment} from "./payment.domain";
import { ulid } from "ulid";
import { addSecond } from "@formkit/tempo";

describe("payment domain", () => {
  const defaultTime = new Date("2026-01-01T10:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(defaultTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("create", () => {
    test("決済オブジェクトが正しく作成されること", () => {
      const input: CreatePaymentInput = {
				userId: ulid(),
        orderId: ulid(),
        transactionId: "tx_123",
        method: "paypal",
        amount: 1000,
        status: "pending"
      } as const;

      const payment = paymentDomain.create(input)._unsafeUnwrap();

      expect(payment.id).toBeDefined();
      expect(payment.orderId).toBe(input.orderId);
      expect(payment.transactionId).toBe(input.transactionId);
      expect(payment.method).toBe(input.method);
      expect(payment.amount).toBe(input.amount);
      expect(payment.currency).toBe("JPY");
      expect(payment.status).toBe("pending");
      expect(payment.createdAt).toEqual(defaultTime);
      expect(payment.updatedAt).toEqual(defaultTime);
    });

    test("金額が0以下の場合はエラーを投げること", () => {
      const input: CreatePaymentInput = {
				userId: ulid(),
        orderId: ulid(),
        transactionId: "tx_123",
        method: "paypal",
        amount: 0,
        status: "pending"
      } as const;

      const res = paymentDomain.create(input);

      expect(res.isErr()).toBe(true);
    });

    test("金額が整数でない場合はエラーを投げること", () => {
      const input: CreatePaymentInput = {
				userId: ulid(),
        orderId: ulid(),
        transactionId: "tx_123",
        method: "paypal",
        amount: 1000.5,
        status: "pending"
      } as const;

      const res = paymentDomain.create(input);

      expect(res.isErr()).toBe(true);
    });

    test("無効な注文IDの場合はエラーを投げること", () => {
      const input: CreatePaymentInput = {
				userId: ulid(),
        orderId: "invalid-order-id",
        transactionId: "tx_123",
        method: "paypal",
        amount: 1000,
        status: "pending"
      } as const;

      const res = paymentDomain.create(input);

      expect(res.isErr()).toBe(true);
    });

    test("無効な支払い方法の場合はエラーを投げること", () => {
      const input: CreatePaymentInput = {
				userId: ulid(),
        orderId: ulid(),
        transactionId: "tx_123",
        method: "invalid-method",
        amount: 1000,
        status: "pending"
      } as const;

      const res = paymentDomain.create(input);

      expect(res.isErr()).toBe(true);
    });

    test("無効なステータスの場合はエラーを投げること", () => {
      const input: CreatePaymentInput = {
				userId: ulid(),
        orderId: ulid(),
        transactionId: "tx_123",
        method: "paypal",
        amount: 1000,
        status: "invalid-status"
      } as const;

      const res = paymentDomain.create(input);

      expect(res.isErr()).toBe(true);
    });
  });

  describe("changeStatus", () => {
    const initialPaymentInput: CreatePaymentInput = {
      userId: ulid(),
      orderId: ulid(),
      transactionId: "tx_123",
      method: "paypal",
      amount: 1000,
      status: "pending",
    };
    const initialPayment = paymentDomain.create(initialPaymentInput)._unsafeUnwrap();

    test("pending から succeeded へ遷移できること", () => {
      vi.advanceTimersByTime(1000);
      const updated = paymentDomain.changeStatus(initialPayment, "succeeded")._unsafeUnwrap();
      expect(updated.status).toBe("succeeded");
      expect(updated.updatedAt.getTime()).eq(addSecond(defaultTime, 1).getTime());
    });

    test("pending から failed へ遷移できること", () => {
      const updated = paymentDomain.changeStatus(initialPayment, "failed")._unsafeUnwrap();
      expect(updated.status).toBe("failed");
    });

    test("succeeded から refunded へ遷移できること", () => {
      const succeededPayment = paymentDomain.changeStatus(initialPayment, "succeeded")._unsafeUnwrap();
      const updated = paymentDomain.changeStatus(succeededPayment, "refunded")._unsafeUnwrap();
      expect(updated.status).toBe("refunded");
    });

    test("不正なステータス遷移(pending -> refunded)はエラーを投げること", () => {
      const res = paymentDomain.changeStatus(initialPayment, "refunded")
      expect(res.isErr()).toBe(true);
    });

    test("不正なステータス遷移(succeeded -> failed)はエラーを投げること", () => {
      const succeededPayment = paymentDomain.changeStatus(initialPayment, "succeeded")._unsafeUnwrap();
      const res = paymentDomain.changeStatus(succeededPayment, "failed")
      expect(res.isErr()).toBe(true);
    });
  });
});
