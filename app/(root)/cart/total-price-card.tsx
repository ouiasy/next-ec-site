import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatJapaneseYen } from "@/lib/utils/process-price";

import { CartDetailedResult } from "@/types/detailed-cart.type";

type TotalPriceCardProps = {
	data: CartDetailedResult;
};

export const TotalPriceCard = ({ data }: TotalPriceCardProps) => {
	return (
		<Card className="text-center w-full">
			<CardHeader>
				<CardTitle className="text-2xl">カート小計</CardTitle>
			</CardHeader>
			<CardContent className="">
				<h3 className="text-xl underline">小計</h3>
				<div className="flex justify-between px-4 py-3 text-xl">
					<p>{data.items.length}点</p>
					<p>{formatJapaneseYen(data.grandTotal)}</p>
				</div>
				<Button asChild>
					<Link href="/shipping">チェックアウト</Link>
				</Button>
			</CardContent>
		</Card>
	);
};
