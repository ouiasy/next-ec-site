import { SelectProductTable } from "@/types/dabatase/product.types";

export const formatJapaneseYen = (price: number) => {
  const formatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(price);
};

export const calculateSubtotal = (
  items: {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    addedAt: number;
    product: SelectProductTable;
  }[],
): number => {
  return items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );
};
