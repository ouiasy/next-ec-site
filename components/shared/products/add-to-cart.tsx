"use client";
import {Button} from "@/components/ui/button";
import {CartItemType} from "@/types/cart";
import {AddItemToCart} from "@/actions/cart.actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";


export const AddToCart = ({item}: {item: CartItemType}) => {
  const router = useRouter()
  const handleAddToCart = async () => {
    const res = await AddItemToCart(item)
    if (!res.success) {
      toast.error("error occurred while adding to cart")
      return
    }
    toast.success(`${item.name} added to cart successfully `, {
      action: {
        label: "Go To Cart",
        onClick: () => router.push("/cart"),
      },
      classNames: {
        actionButton: "p-4"
      }
    })
  }
  return (
      <Button
          className="w-full"
          variant="outline"
          onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
  )
}