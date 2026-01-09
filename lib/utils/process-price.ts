import {GetCartItemsData} from "@/types/dto/response/cart.actions.response";


export const formatJapaneseYen = (price: number | null) => {
    if (price === null) {
        return "-"
    }
    const formatter = new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(price);
};

export const calculateSubtotal = (
    items: GetCartItemsData[],
): number => {
    return items.reduce(
        (sum, item) => sum + item.quantity * item.priceInTax,
        0,
    );
};
