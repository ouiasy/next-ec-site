import { isValid, ulid } from "ulid";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { shipmentDomain } from "./shipment.domain";
import { InvalidIdError, InvalidShipmentStatusError, InvalidValueError } from "./shipment.domain.errors";
import { addSecond } from "@formkit/tempo";


describe("shipment domain", () => {
  const defaultTime = new Date("2026-01-01T10:00:00Z");
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(defaultTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
	describe("create", () => {
		test("正常に配送エンティティが生成される", () => {
			const res = shipmentDomain.create({
				userId: ulid(),
				orderId: ulid(),
			})._unsafeUnwrap();
			expect(isValid(res.id)).toBe(true);
			expect(isValid(res.userId)).toBe(true);
			expect(isValid(res.orderId)).toBe(true);
			expect(res.trackingId).toBeNull();
			expect(res.carrier).toBeNull();
			expect(res.status).toBe("preparing");
			expect(res.shippedAt).toBeNull();
			expect(res.createdAt).toEqual(defaultTime);
			expect(res.updatedAt).toEqual(defaultTime);
		});

		test("無効なユーザーIDで配送エンティティが生成できない", () => {
			const res = shipmentDomain.create({
				userId: "invalid",
				orderId: ulid(),
			});
			expect(res.isErr()).toBe(true);
			if (res.isErr()) {
				expect(res.error).toBeInstanceOf(InvalidIdError);
			}
			
		});

		test("無効な注文IDで配送エンティティが生成できない", () => {
			const res = shipmentDomain.create({
				userId: ulid(),
				orderId: "invalid",
			});
			expect(res.isErr()).toBe(true);
			if (res.isErr()) {
				expect(res.error).toBeInstanceOf(InvalidIdError);
			}
		});
	});

	describe("updateStatus", () => {
		test("正常に配送エンティティの状態が更新される", () => {
			const original = shipmentDomain.create({
				userId: ulid(),
				orderId: ulid(),
			})._unsafeUnwrap();
			vi.advanceTimersByTime(1000);
			const res = shipmentDomain.updateStatus(original, {
				trackingId: "123",
				carrier: "carrier",
				status: "shipped",
			});
			expect(res.isOk()).toBe(true);
			if (res.isOk()) {
				expect(res.value.id).toBe(original.id);
				expect(res.value.userId).toBe(original.userId);
				expect(res.value.orderId).toBe(original.orderId);
				expect(res.value.trackingId).toBe("123");
				expect(res.value.carrier).toBe("carrier");
				expect(res.value.status).toBe("shipped");
				expect(res.value.shippedAt).toEqual(addSecond(defaultTime, 1));
				expect(res.value.updatedAt).toEqual(addSecond(defaultTime, 1));
			}
		});

		test("無効な配送状態に更新できない", () => {
			const original = shipmentDomain.create({
				userId: ulid(),
				orderId: ulid(),
			})._unsafeUnwrap();
			vi.advanceTimersByTime(1000);
			const res = shipmentDomain.updateStatus(original, {
				trackingId: "123",
				carrier: "carrier",
				status: "preparing",
			});
			expect(res.isErr()).toBe(true);
			if (res.isErr()) {
				expect(res.error).toBeInstanceOf(InvalidShipmentStatusError);
			}
		});

		test("無効なキャリア名で配送エンティティの状態が更新できない", () => {
			const original = shipmentDomain.create({
				userId: ulid(),
				orderId: ulid(),
			})._unsafeUnwrap();
			vi.advanceTimersByTime(1000);
			const res = shipmentDomain.updateStatus(original, {
				trackingId: "123",
				carrier: "",
				status: "shipped",
			});
			expect(res.isErr()).toBe(true);
			if (res.isErr()) {
				expect(res.error).toBeInstanceOf(InvalidValueError);
			}
		});

		test("無効なトラッキングIDで配送エンティティの状態が更新できない", () => {
			const original = shipmentDomain.create({
				userId: ulid(),
				orderId: ulid(),
			})._unsafeUnwrap();
			vi.advanceTimersByTime(1000);
			const res = shipmentDomain.updateStatus(original, {
				trackingId: "",
				carrier: "carrier",
				status: "shipped",
			});
			expect(res.isErr()).toBe(true);
			if (res.isErr()) {
				expect(res.error).toBeInstanceOf(InvalidValueError);
			}
		});
	});

});