import { describe, expect, test } from "vitest";
import { CreateOrderInput, orderDomain } from "@/domain/order/order.domain";
import { OrderAddress } from "@/domain/order/order.types";

describe("orderDomain", () => {
  const dummyAddress: OrderAddress = {
    name: "Taro Yamada",
    postalCode: "123-4567",
    prefecture: "Tokyo",
    city: "Shibuya",
    street: "1-2-3",
    building: "Tech Tower 101",
  };

  describe("create", () => {
    test("注文が正しく作成され、合計金額が計算されること (送料あり)", () => {
      const input: CreateOrderInput = {
        userId: "user-1",
        items: [
          {
            productId: "prod-1",
            productName: "Product 1",
            priceExTax: 1000,
            taxRate: 10, // 10%
            quantity: 2,
          },
        ],
      };

      const order = orderDomain.create(input);

      // 基本情報の確認
      expect(order.id).toBeDefined();
      expect(order.userId).toBe(input.userId);
      expect(order.orderStatus).toBe("pending");
      expect(order.shippingAddress).toBeNull();
      expect(order.billingAddress).toBeNull();
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);

      // アイテムの確認
      expect(order.orderItems).toHaveLength(1);
      expect(order.orderItems[0].id).toBeDefined();
      expect(order.orderItems[0].productId).toBe("prod-1");
      expect(order.orderItems[0].quantity).toBe(2);

      // 金額計算の確認
      expect(order.itemsSubtotal).toBe(2000);
      expect(order.taxTotal).toBe(200); // 2000 * 0.1 / 100 = 2
      expect(order.shippingFee).toBe(500); // 2000 + 2 = 2002 <= 5000
      expect(order.grandTotal).toBe(2700);
    });

    test("合計金額が5000円を超える場合、送料が無料になること", () => {
      const input: CreateOrderInput = {
        userId: "user-1",
        items: [
          {
            productId: "prod-2",
            productName: "Expensive Product",
            priceExTax: 4600,
            taxRate: 10, // 10%
            quantity: 1,
          },
        ],
      };

      const order = orderDomain.create(input);

      // itemsSubtotal: 5000
      // taxTotal: Math.floor(5000 * 1 * 10 / 100) = 500
      // subtotal + tax = 5500 > 5000 => shippingFee = 0
      expect(order.itemsSubtotal).toBe(4600);
      expect(order.taxTotal).toBe(460);
      expect(order.shippingFee).toBe(0);
      expect(order.grandTotal).toBe(5060);
    });

    test("複数種類のアイテム, 税率に対しても正常に合計金額を計算できること", () => {
      const input: CreateOrderInput = {
        userId: "user-1",
        items: [
          {
            productId: "prod-2",
            productName: "Expensive Product",
            priceExTax: 4600,
            taxRate: 10, // 10%
            quantity: 3,
          },
          {
            productId: "prod-3",
            productName: "special product",
            priceExTax: 5200,
            taxRate: 8,
            quantity: 2,
          }
        ],
      };

      const order = orderDomain.create(input)

      expect(order.orderItems).toHaveLength(2)
      expect(order.orderItems[0].productId).toBe("prod-2")
      expect(order.orderItems[1].productId).toBe("prod-3")

      expect(order.itemsSubtotal).toBe(24_200) // 13_800 + 10_400
      expect(order.taxTotal).toBe(2_212) // 1_380 + 832
      expect(order.shippingFee).toBe(0)
      expect(order.grandTotal).toBe(26_412)
    })
  });


  describe("insertShippingAddr", () => {
    test("配送先住所が正しく設定されること", () => {
      const input: CreateOrderInput = {
        userId: "user-1",
        items: [],
      };
      const order = orderDomain.create(input);
      
      const updatedOrder = orderDomain.insertShippingAddr(order, dummyAddress);
      
      expect(updatedOrder.shippingAddress).toEqual(dummyAddress);
      // 元のオブジェクトが変更されていないこと (不変性の確認)
      expect(order.shippingAddress).toBeNull();
    });
  });

  describe("insertBillingAddr", () => {
    test("請求先住所が正しく設定されること", () => {
      const input: CreateOrderInput = {
        userId: "user-1",
        items: [],
      };
      const order = orderDomain.create(input);
      
      const updatedOrder = orderDomain.insertBillingAddr(order, dummyAddress);
      
      expect(updatedOrder.billingAddress).toEqual(dummyAddress);
      // 元のオブジェクトが変更されていないこと (不変性の確認)
      expect(order.billingAddress).toBeNull();
    });
  });
});
