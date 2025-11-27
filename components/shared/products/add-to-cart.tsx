"use client";
import {Button} from "@/components/ui/button";
import {CartItemType} from "@/types/cart.type";
import {AddItemToCart} from "@/actions/cart.actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client";


export const AddToCart = ({item}: {item: CartItemType}) => {
  const router = useRouter()
  const handleAddToCart = async () => {
    const res = await AddItemToCart(item)
    if (!res.success) {
      toast.error(res.message)
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