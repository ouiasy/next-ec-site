import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import {
  removeOneItemFromCart,
  addOneItemToCart,
} from "@/api/actions/cart.actions";
import { formatJapaneseYen } from "@/lib/utils/process-price";
import { toast } from "sonner";
import {GetCartItemsData} from "@/types/dto/response/cart.actions.response";

export const CartItemRow = ({ item }: { item: GetCartItemsData }) => {
  const [isPending, startTransition] = useTransition();
  const handleDecreaseButton = (productId: string) =>
    startTransition(async () => {
      const res = await removeOneItemFromCart(productId);
      // if not success show error toast.
      if (!res.success) {
        toast.error(res.message);
        return;
      }
    });
  const handleAddButton = (productId: string) =>
    startTransition(async () => {
      const res = await addOneItemToCart(productId);
      console.log(res);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
    });
  return (
    <TableRow key={item.slug}>
      <TableCell>
        <Link
          href={`/product/${item.slug}`}
          className="flex gap-7 items-center"
        >
          <Image
            className="rounded-xs"
            src={item.imageUrl ?? "/images/not-found.png"}
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
          onClick={() => handleDecreaseButton(item.productId)} // todo: change to productid
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
          onClick={() => handleAddButton(item.productId)} // todo: change to productid
        >
          <Plus />
        </Button>
      </TableCell>
      <TableCell className="">
        <span className="text-xl">{formatJapaneseYen(item.priceInTax)}</span>
      </TableCell>
    </TableRow>
  );
};
