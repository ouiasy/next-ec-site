import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateSubtotal } from "@/lib/utils/process-price";
import { formatJapaneseYen } from "@/lib/utils/process-price";
import {countItems} from "@/lib/utils";
import {GetCartItemsData} from "@/types/dto/response/cart.actions.response";
import {CheckoutButton} from "@/app/(root)/cart/checkout-btn";
type TotalPriceCardProps = {
  items: GetCartItemsData[];
}

export const TotalPriceCard = ({ items }: TotalPriceCardProps) => {
  return (
    <Card className="text-center w-full">
      <CardHeader>
        <CardTitle className="text-2xl">カート小計</CardTitle>
      </CardHeader>
      <CardContent className="">
        <h3 className="text-xl underline">小計</h3>
        <div className="flex justify-between px-4 py-3 text-xl">
          <p>{countItems(items)}点</p>
          <p>{formatJapaneseYen(calculateSubtotal(items))}</p>
        </div>
        <CheckoutButton/>
      </CardContent>
    </Card>
  );
};
