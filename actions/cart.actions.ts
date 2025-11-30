"use server";

import { CartItemType, CartType } from "@/types/cart.type";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { cartItems, carts } from "@/db/schema/cart.schema";
import { products } from "@/db/schema/product.schema";
import { cartItemSchema } from "@/zod/cart.zod";
import { z } from "zod";
import { ProductType } from "@/types/product.type";

export const AddItemToCart = async (
  item: CartItemType,
): Promise<{ success: boolean; message: string }> => {
  try {
    const validatedItem = cartItemSchema.parse(item);

    // stock check
    const productInfo = await db.query.products.findFirst({
      where: eq(products.id, validatedItem.productId),
    });
    if (productInfo == undefined) {
      return {
        success: false,
        message: "product not found",
      };
    }
    if (productInfo.stock! < validatedItem.qty!) {
      return {
        success: false,
        message: "quantity exceeds our stock",
      };
    }

    // session check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    let userId = session?.user.id;
    if (userId == undefined) {
      const session = await auth.api.signInAnonymous({
        headers: await headers(),
      });
      if (session == null) {
        return {
          success: false,
          message: "error creating an anonymous user..",
        };
      }
      userId = session.user.id;
    }

    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    });
    if (cart == undefined) {
      cart = (
        await db
          .insert(carts)
          .values({
            userId: userId,
          })
          .returning()
      )[0];
    }

    // update cart
    await db
      .insert(cartItems)
      .values({
        cartId: cart.id,
        productId: productInfo.id,
        quantity: validatedItem.qty!,
      })
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.productId],
        set: { quantity: validatedItem.qty },
      });

    return {
      success: true,
      message: "added to cart successfully.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues.join(". "),
      };
    } else if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    } else {
      return {
        success: false,
        message: "unknown error",
      };
    }
  }
};

export const removeItemFromCart = async (
  productId: string,
  productName: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const session = await auth.api.getSession();
    if (session === null) {
      return {
        success: false,
        message: "should login first..",
      };
    }
    const userId = session.user.id;

    // get cartId
    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    });
    if (cart === undefined) {
      return {
        success: false,
        message: "cart not found",
      };
    }

    // remove cartItem
    const res = await db
      .delete(cartItems)
      .where(eq(cartItems.productId, productId));

    return {
      success: true,
      message: ` ${productName} をカートから除きました`,
    };
  } catch (error) {
    return {
      success: false,
      message: "未知のエラーが生じました。",
    };
  }
};

interface GetCartItemsState {
  success: boolean;
  message?: string;
  data: GetCartItemsData | null;
}

interface GetCartItemsData extends CartType {
  cartItems: {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    addedAt: number;
    product: ProductType;
  }[];
}

export const getCartItems = async (): Promise<GetCartItemsState> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session === null) {
      return {
        success: false,
        message: "ログインしてください。",
        data: null,
      };
    }
    const userId = session.user.id;

    const res = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        cartItems: {
          with: {
            product: true,
          },
        },
      },
    });

    if (res === undefined) {
      return {
        success: true,
        message: "カートが見つかりませんでした。",
        data: null,
      };
    }

    console.log(res);
    return {
      success: true,
      data: res,
    };
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    return {
      success: false,
      message:
        "データの取得中にエラーが発生しました。しばらく経ってから再試行してください。",
      data: null,
    };
  }
};
