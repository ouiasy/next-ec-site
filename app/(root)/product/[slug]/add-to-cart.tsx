"use client";
import { Button } from "@/components/ui/button";
import { CartItemPayload } from "@/types/schema/cart.type";
import { AddItemToCart } from "@/actions/cart.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AddToCartCard = ({ item }: { item: CartItemPayload }) => {
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleAddToCart = async () => {
    startTransition(async () => {
      if (quantity === undefined) {
        toast.error("数量を選択してください");
        return;
      }
      const res = await AddItemToCart(item, quantity);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(`${item.name} がカートに入りました `, {
        action: {
          label: "Go To Cart",
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
            {/*TODO : fix here*/}
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button className="w-full" variant="outline" onClick={handleAddToCart}>
        {isPending ? <Spinner /> : "カートに入れる"}
      </Button>
    </div>
  );
};
