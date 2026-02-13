import "server-only";

import { DB } from "@/db";
import { paymentTable } from "@/db/schema/order.schema";
import { Payment, PaymentRepository } from "@/domain/payment/payment.domain";
import { RepositoryError } from "@/domain/repository.error";
import { Result, ok, err } from "neverthrow";
import { ULID } from "ulid";
import { eq, desc } from "drizzle-orm";

export type RawPaymentSelect = typeof paymentTable.$inferSelect;
export type RawPaymentInsert = typeof paymentTable.$inferInsert;

const fromRawPayment = (rawPayment: RawPaymentSelect): Payment => {
    return {
        id: rawPayment.id,
        userId: rawPayment.userId,
        orderId: rawPayment.orderId,
        transactionId: rawPayment.transactionId,
        method: rawPayment.method,
        amount: rawPayment.amount,
        currency: rawPayment.currency,
        status: rawPayment.status,
        createdAt: rawPayment.createdAt,
        updatedAt: rawPayment.updatedAt,
    }
}

const toRawPayment = (payment: Payment): RawPaymentInsert => {
    return {
        id: payment.id,
        userId: payment.userId,
        orderId: payment.orderId,
        transactionId: payment.transactionId,
        method: payment.method,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,

        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
    }
}

export const createPaymentRepository = (db: DB): PaymentRepository => {
    return {
        save: async (payment: Payment): Promise<Result<Payment, RepositoryError>> => {
            try {
                const rawPayment = toRawPayment(payment);
                const rawUpdatedPayment = await db.insert(paymentTable).values(rawPayment).onConflictDoUpdate({
                    target: paymentTable.id,
                    set: {
                        ...rawPayment,
                    }
                }).returning();

                return ok(fromRawPayment(rawUpdatedPayment[0]))
            } catch (e) {
                return err(new RepositoryError("支払い情報の更新に失敗しました", { cause: e }));
            }
        },

        getPaymentsByOrderId: async (orderId: ULID): Promise<Result<Payment[], RepositoryError>> => {
            try {
                const rawPayments = await db.select()
                    .from(paymentTable)
                    .where(eq(paymentTable.orderId, orderId))
                    .orderBy(desc(paymentTable.createdAt));
                const payments = rawPayments.map(fromRawPayment);
                return ok(payments);
            } catch (e) {
                return err(new RepositoryError("注文の支払い情報を取得するのに失敗しました"));
            }
        },

        getPaymentsByUserId: async (userId: ULID): Promise<Result<Payment[], RepositoryError>> => {
            try {
                const rawPayments = await db.select()
                    .from(paymentTable)
                    .where(eq(paymentTable.userId, userId))
                    .orderBy(desc(paymentTable.createdAt));
                const payments = rawPayments.map(fromRawPayment);
                return ok(payments);
            } catch (e) {
                return err(new RepositoryError("ユーザーの支払い情報を取得するのに失敗しました"));
            }
        }
    }
}