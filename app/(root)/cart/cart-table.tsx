"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {CartItemRow} from "./cart-item-row";
import {GetCartItemsData} from "@/types/dto/response/cart.actions.response";


type CartTableProps = {
  items: GetCartItemsData[]
}

export const CartTable = ({items}: CartTableProps) => {
  return (
    <Table className="overflow-x-scroll">
      <TableHeader>
        <TableRow>
          <TableHead className="text-xl">Item</TableHead>
          <TableHead className="text-xl">Quantity</TableHead>
          <TableHead className="text-xl">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          if (item.quantity > 0) {
            return <CartItemRow item={item} key={item.slug}/>;
          }
        })}
      </TableBody>
    </Table>
  );
};
