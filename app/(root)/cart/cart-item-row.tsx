import { TableCell, TableRow } from "@/components/ui/table";
import { SelectProductTable } from "@/types/dabatase/product.types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import {
  removeOneItemFromCart,
  addOneItemToCart,
} from "@/actions/cart.actions";
import { formatJapaneseYen } from "@/lib/utils/process-price";
import { toast } from "sonner";

type CartItemRowProps = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  addedAt: number;
  product: SelectProductTable;
};

export const CartItemRow = ({ item }: { item: CartItemRowProps }) => {
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
        <span className="text-xl">{formatJapaneseYen(item.product.price)}</span>
      </TableCell>
    </TableRow>
  );
};
