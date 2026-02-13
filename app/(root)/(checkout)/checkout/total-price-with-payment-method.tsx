"use client";

import { PaymentButtons } from "@/app/(root)/(checkout)/checkout/payment-buttons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const TotalPriceWithPaymentMethod = () => {
	return (
		<Card className="p-4 rounded-md">
			<div>金額内訳</div>
			<div>クーポンコード</div>
			<div className="flex gap-5">
				<Input />
				<Button variant="outline" className="cursor-pointer">
					適用
				</Button>
			</div>
			<hr />
			<div>支払い方法の選択</div>
			<PaymentButtons />
		</Card>
	);
};
