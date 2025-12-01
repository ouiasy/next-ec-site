"use server";

import { CartItemPayload, CartType } from "@/types/cart.type";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { cartItemSchema } from "@/zod/cart.zod";
import { z } from "zod";
import { ProductType } from "@/types/product.type";
import {cartItemsRelations, cartItemTable, cartTable} from "@/db/schema/cart.schema";

export const AddItemToCart = async (
  item: CartItemPayload,
): Promise<{ success: boolean; message: string }> => {
  try {
    const validatedItem = cartItemSchema.parse(item);

    // stock check
    const productInfo = await db.query.productTable.findFirst({
      where: eq(products.id, validatedItem.productId),
    });
    if (productInfo == undefined) {
      return {
        success: false,
        message: "該当の商品が見つかりません。",
      };
    }
    if (productInfo.stock! < validatedItem.qty!) {
      return {
        success: false,
        message: "数量が在庫数を超えています。",
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
          message: "ゲストユーザーの作成に失敗しました。",
        };
      }
      userId = session.user.id;
    }

    let cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, userId),
    });
    if (cart == undefined) {
      cart = (
        await db
          .insert(cartTable)
          .values({
            userId: userId,
          })
          .returning()
      )[0];
    }

    // update cart
    await db
      .insert(cartItemTable)
      .values({
        cartId: cart.id,
        productId: productInfo.id,
        quantity: validatedItem.qty!,
      })
      .onConflictDoUpdate({
        target: [cartItemTable.cartId, cartItemTable.productId],
        set: { quantity: validatedItem.qty },
      });

    return {
      success: true,
      message: "カートにアイテムを追加しました。",
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
        message: "未定義のエラー",
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
        message: "最初にログインしてください",
      };
    }
    const userId = session.user.id;

    // get cartId
    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, userId),
    });
    if (cart === undefined) {
      return {
        success: false,
        message: "",
      };
    }

    // remove cartItem
    const res = await db
      .delete(cartItemTable)
      .where(eq(cartItemTable.productId, productId));

    return {
      success: true,
      message: ` ${productName} をカートから除きました`,
    };
  } catch (error) {
    return {
      success: false,
      message: "未定義のエラー",
    };
  }
};

type GetCartItemsResult = {
  success: boolean;
  message?: string;
  data: GetCartItemsData | null;
};

type GetCartItemsData = CartType & {
  cartItems: {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    addedAt: number;
    product: ProductType;
  }[];
};

export const getCartItems = async (): Promise<GetCartItemsResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session === null) {
      return {
        success: false,
        message: "ログインしてください",
        data: null,
      };
    }
    const userId = session.user.id;

    const res = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, userId),
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
        message: "カートが見つかりませんでした",
        data: null,
      };
    }

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
