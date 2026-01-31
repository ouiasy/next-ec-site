"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { changeCartItem } from "@/actions/cart.actions";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export const AddToCartCard = ({
	productId,
	stock,
	productName,
}: {
	productId: string;
	stock: number;
	productName: string;
}) => {
	const [quantity, setQuantity] = useState<number>(1);
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const handleAddToCart = async () => {
		startTransition(async () => {
			if (quantity === undefined) {
				toast.error("数量を選択してください");
				return;
			}
			const res = await changeCartItem(productId, quantity);
			if (!res.success) {
				toast.error(res.error);
				return;
			}
			toast.success(`${productName} がカートに入りました `, {
				action: {
					label: "カートをみる",
					onClick: () => router.push("/cart"),
				},
				classNames: {
					actionButton: "p-4",
				},
			});
		});
	};
	return (
		<div className="flex justify-center flex-col gap-3 mt-10">
			<Select
				value={quantity?.toString()}
				onValueChange={(val) => setQuantity(parseInt(val))}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="select quantity" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{Array.from({ length: stock > 10 ? 10 : stock }).map((_, idx) => {
							const num = idx + 1;
							return (
								<SelectItem value={num.toString()} key={num}>
									{num}
								</SelectItem>
							);
						})}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Button className="w-full" variant="outline" onClick={handleAddToCart}>
				{isPending ? <Spinner /> : "カートに入れる"}
			</Button>
		</div>
	);
};
