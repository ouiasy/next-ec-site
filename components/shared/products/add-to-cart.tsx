"use client";
import { Button } from "@/components/ui/button";
import { CartItemType } from "@/types/cart.type";
import { AddItemToCart } from "@/actions/cart.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AddToCart = ({ item }: { item: CartItemType }) => {
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const router = useRouter();
  const handleAddToCart = async () => {
    if (quantity === undefined) {
      toast.error("select quantity to add");
      return;
    }
    const addItem: CartItemType = {
      ...item,
      qty: quantity,
    };
    const res = await AddItemToCart(addItem);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(`${item.name} added to cart successfully `, {
      action: {
        label: "Go To Cart",
        onClick: () => router.push("/cart"),
      },
      classNames: {
        actionButton: "p-4",
      },
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
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button className="w-full" variant="outline" onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </div>
  );
};
