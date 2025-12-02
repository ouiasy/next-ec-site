"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { cartItemTable, cartTable } from "@/db/schema/cart.schema";
import { productTable } from "@/db/schema/product.schema";
import { SelectProductTable } from "@/types/dabatase/product.types";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const addOneItemToCart = async (productId: string) => {
  try {
    const productInfo = await db.query.productTable.findFirst({
      where: eq(productTable.id, productId),
    });
    if (productInfo === undefined) {
      return {
        success: false,
        messsage: "商品が見つかりませんでした",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session === null) {
      return {
        success: false,
        message: "ユーザーが見つかりません。ログインしてください。",
      };
    }

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, session.user.id),
    });
    if (cart === undefined) {
      return {
        success: false,
        message: "カートが見つかりませんでした",
      };
    }

    const cartItem = await db.query.cartItemTable.findFirst({
      where: and(
        eq(cartItemTable.cartId, cart.id),
        eq(cartItemTable.productId, productInfo.id),
      ),
    });
    if (cartItem === undefined) {
      return {
        success: false,
        message: "カートに該当の商品がありません",
      };
    }

    if (cartItem.quantity + 1 > productInfo.stock) {
      return {
        success: false,
        message: "商品の数が在庫数を超えてしまいます",
      };
    }

    await db
      .update(cartItemTable)
      .set({
        quantity: sql`${cartItemTable.quantity} + 1`,
      })
      .where(eq(cartItemTable.id, cartItem.id));

    revalidatePath("/cart");

    return {
      success: true,
      message: "該当の商品を1つ追加しました。",
    };
  } catch (error) {
    return {
      success: false,
      message: "カートに商品を追加できませんでした",
    };
  }
};

export const AddItemToCart = async (
  productId: string,
  quantity: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    // stock check
    const productInfo: SelectProductTable | undefined =
      await db.query.productTable.findFirst({
        where: eq(productTable.id, productId),
      });
    if (productInfo === undefined) {
      return {
        success: false,
        message: "該当の商品が見つかりません。",
      };
    }
    if (productInfo.stock < quantity) {
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
        quantity: quantity,
      })
      .onConflictDoUpdate({
        target: [cartItemTable.cartId, cartItemTable.productId],
        set: { quantity: quantity },
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

export const removeOneItemFromCart = async (productId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session === null) {
      return {
        success: false,
        message: "最初にログインしてください",
      };
    }

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, session.user.id),
    });
    if (cart === undefined) {
      return {
        success: false,
        message: "カートが見つかりませんでした",
      };
    }

    await db
      .update(cartItemTable)
      .set({
        quantity: sql`${cartItemTable.quantity} -1`,
      })
      .where(eq(cartItemTable.productId, productId));

    revalidatePath("/cart");

    return {
      success: true,
      message: `カートから商品を一つ取り出しました`,
    };
  } catch (error) {
    return {
      success: false,
      message: "カートから取り除くことに失敗しました",
    };
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
        message: "カートがありません。",
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

export type GetCartItemsData = {
  id: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  cartItems: {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    addedAt: number;
    product: SelectProductTable;
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
