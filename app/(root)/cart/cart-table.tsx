"use client";
import { GetCartItemsData } from "@/actions/cart.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { formatJapaneseYen } from "@/utils/process-price";
import Link from "next/link";
import { useTransition } from "react";

export type CartProps = {
  items: GetCartItemsData["cartItems"];
};

export const CartTable = ({ items }: CartProps) => {
  const [isPending, startTransition] = useTransition();
  const handleDecreaseButton = () =>
    startTransition(async () => {
      // remove item server actions
      // if not success show error toast.
    });
  const handleAddButton = () =>
    startTransition(async () => {
      // remove item server actions
      // if not success show error toast.
    });
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
          return (
            <TableRow key={item.id}>
              <TableCell>
                <Link
                  href={`/product/${item.product.slug}`}
                  className="flex gap-7 items-center"
                >
                  <Image
                    className="rounded-xs"
                    src={item.product.images[0]}
                    height={50}
                    width={50}
                    alt={item.product.name}
                  />
                  <span className="text-xl">{item.product.name}</span>
                </Link>
              </TableCell>
              <TableCell>
                <Button
                  className="cursor-pointer"
                  onClick={handleDecreaseButton}
                >
                  <Minus className="" />
                </Button>
                <span className="p-2 text-xl">{item.quantity}</span>
                <Button className="cursor-pointer" onClick={handleAddButton}>
                  <Plus />
                </Button>
              </TableCell>
              <TableCell>
                <span className="text-xl">
                  {formatJapaneseYen(item.product.price)}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
