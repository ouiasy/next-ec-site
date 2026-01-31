import {describe, expect, test} from "vitest";
import {paymentDomain, type Payment} from "./payment.domain";

describe("payment domain", () => {
  describe("create", () => {
    test("決済オブジェクトが正しく作成されること", () => {
      const input = {
        orderId: "order_1",
        transactionId: "tx_123",
        method: "paypal",
        amount: 1000,
      } as const;

      const payment = paymentDomain.create(input);

      expect(payment.id).toBeDefined();
      expect(payment.orderId).toBe(input.orderId);
      expect(payment.transactionId).toBe(input.transactionId);
      expect(payment.method).toBe(input.method);
      expect(payment.amount).toBe(input.amount);
      expect(payment.currency).toBe("JPY");
      expect(payment.status).toBe("pending");
      expect(payment.createdAt).toBeInstanceOf(Date);
      expect(payment.updatedAt).toBeInstanceOf(Date);
      expect(payment.createdAt).toEqual(payment.updatedAt);
    });

    test("金額が0以下の場合はエラーを投げること", () => {
      const input = {
        orderId: "order_1",
        transactionId: "tx_123",
        method: "paypal",
        amount: 0,
      } as const;

      expect(() => paymentDomain.create(input)).toThrow("金額は0より大きい必要があります");
    });
  });

  describe("changeStatus", () => {
    const initialPayment: Payment = {
      id: "pay_1",
      orderId: "order_1",
      transactionId: "tx_123",
      method: "paypal",
      amount: 1000,
      currency: "JPY",
      status: "pending",
      createdAt: new Date("2025-01-01T00:00:00Z"),
      updatedAt: new Date("2025-01-01T00:00:00Z"),
    };

    test("pending から succeeded へ遷移できること", () => {
      const updated = paymentDomain.changeStatus(initialPayment, "succeeded");
      expect(updated.status).toBe("succeeded");
      expect(updated.updatedAt.getTime()).toBeGreaterThan(initialPayment.updatedAt.getTime());
    });

    test("pending から failed へ遷移できること", () => {
      const updated = paymentDomain.changeStatus(initialPayment, "failed");
      expect(updated.status).toBe("failed");
    });

    test("succeeded から refunded へ遷移できること", () => {
      const succeededPayment: Payment = { ...initialPayment, status: "succeeded" };
      const updated = paymentDomain.changeStatus(succeededPayment, "refunded");
      expect(updated.status).toBe("refunded");
    });

    test("不正なステータス遷移（pending -> refunded）はエラーを投げること", () => {
      expect(() => paymentDomain.changeStatus(initialPayment, "refunded"))
        .toThrow("不正なステータスの遷移です");
    });

    test("不正なステータス遷移（succeeded -> failed）はエラーを投げること", () => {
      const succeededPayment: Payment = { ...initialPayment, status: "succeeded" };
      expect(() => paymentDomain.changeStatus(succeededPayment, "failed"))
        .toThrow("不正なステータスの遷移です");
    });
  });
});
