"use client";
import { GetCartItemsData } from "@/actions/cart.actions";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CartItemRow } from "./cart-item-row";

export type CartProps = {
  items: GetCartItemsData["cartItems"];
};

export const CartTable = ({ items }: CartProps) => {
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
          return <CartItemRow item={item} key={item.id} />;
        })}
      </TableBody>
    </Table>
  );
};
