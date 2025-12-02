"use client";
import {
  addOneItemToCart,
  GetCartItemsData,
  removeOneItemFromCart,
} from "@/actions/cart.actions";
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
import { Plus, Minus, Divide } from "lucide-react";
import { formatJapaneseYen } from "@/utils/process-price";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type CartProps = {
  items: GetCartItemsData["cartItems"];
};

export const CartTable = ({ items }: CartProps) => {
  const [isPending, startTransition] = useTransition();
  const handleDecreaseButton = (productId: string) =>
    startTransition(async () => {
      const res = await removeOneItemFromCart(productId);
      // if not success show error toast.
      if (!res.success) {
        toast.error("カートから商品を取り除くのに失敗しました。");
        return;
      }
    });
  const handleAddButton = (productId: string) =>
    startTransition(async () => {
      const res = await addOneItemToCart(productId);
      console.log(res);
      if (!res.success) {
        toast.error("カートに商品を追加するのに失敗しました");
        return;
      }
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
              <TableCell className="flex items-center">
                <Button
                  className="cursor-pointer"
                  disabled={isPending}
                  onClick={() => handleDecreaseButton(item.productId)}
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
                  onClick={() => handleAddButton(item.productId)}
                >
                  <Plus />
                </Button>
              </TableCell>
              <TableCell className="">
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
