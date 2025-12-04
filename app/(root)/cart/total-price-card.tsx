import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CartProps } from "./cart-table";
import { Button } from "@/components/ui/button";
import { calculateSubtotal } from "@/utils/process-price";
import { formatJapaneseYen } from "@/utils/process-price";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const TotalPriceCard = ({ items }: CartProps) => {
  return (
    <Card className="text-center w-full">
      <CardHeader>
        <CardTitle className="text-2xl">カート小計</CardTitle>
      </CardHeader>
      <CardContent className="">
        <h3 className="text-xl underline">小計</h3>
        <div className="flex justify-between px-4 py-3 text-xl">
          <p>3点</p>
          <p>{formatJapaneseYen(calculateSubtotal(items))}</p>
        </div>
        <Button className="w-full cursor-pointer items-center" asChild>
          <Link href="/shipping">
            <ArrowRight className="" />
            チェックアウト
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
