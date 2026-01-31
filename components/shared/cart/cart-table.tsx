"use client";
import { CartItemRow } from "@/components/shared/cart/cart-item-row";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CartItem } from "@/domain/cart/cart.domain";
import { DetailedCartItem } from "@/types/detailed-cart.type";

type CartTableProps = {
	items: DetailedCartItem[];
};

export const CartTable = ({ items }: CartTableProps) => {
	return (
		<Table className="overflow-x-scroll">
			<TableHeader>
				<TableRow>
					<TableHead className="text-muted-foreground">商品</TableHead>
					<TableHead className="text-md">数量</TableHead>
					<TableHead className="text-xl">単価(税込)</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((item) => {
					if (item.quantity > 0) {
						return <CartItemRow item={item} key={item.productId} />;
					}
				})}
			</TableBody>
		</Table>
	);
};
