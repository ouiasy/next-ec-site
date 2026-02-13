import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { changeCartItem } from "@/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatJapaneseYen } from "@/lib/utils/process-price";

import { DetailedCartItem } from "@/types/detailed-cart.type";

export const CartItemRow = ({ item }: { item: DetailedCartItem }) => {
	const [isPending, startTransition] = useTransition();
	const handleDecreaseButton = (productId: string) =>
		startTransition(async () => {
			const res = await changeCartItem(productId, -1, "by");
			if (!res.success) {
				toast.error(res.error);
				return;
			}
		});
	const handleAddButton = (productId: string) =>
		startTransition(async () => {
			const res = await changeCartItem(productId, 1, "by");
			console.log(res);
			if (!res.success) {
				toast.error(res.error);
				return;
			}
		});
	return (
		<TableRow key={item.productId}>
			<TableCell>
				<Link
					href={`/product/${item.productId}`}
					className="flex gap-7 items-center"
				>
					<Image
						className="rounded-xs"
						src={item.productImages[0].url ?? "/images/not-found.png"}
						height={50}
						width={50}
						alt={item.name ?? "item image"}
					/>
					<span className="text-xl">{item.name}</span>
				</Link>
			</TableCell>
			<TableCell className="flex items-center">
				<Button
					className="cursor-pointer"
					disabled={isPending}
					onClick={() => handleDecreaseButton(item.productId)}
					variant="outline"
				>
					<Minus className="" />
				</Button>
				<div className="w-8 text-center">
					{isPending ? (
						<Spinner className="mx-auto" />
					) : (
						<div>
							<span className="text-xl">{item.quantity}</span>
						</div>
					)}
				</div>

				<Button
					className="cursor-pointer"
					disabled={isPending}
					variant="outline"
					onClick={() => handleAddButton(item.productId)}
				>
					<Plus />
				</Button>
			</TableCell>
			<TableCell className="">
				<span className="text-xl">{formatJapaneseYen(item.priceAfterTax)}</span>
			</TableCell>
		</TableRow>
	);
};
