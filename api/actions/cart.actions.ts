"use server";

import {headers} from "next/headers";
import {auth} from "@/lib/auth/auth";
import {db} from "@/db";
import {and, eq, sql} from "drizzle-orm";
import {z} from "zod";
import {cartItemTable, cartTable} from "@/db/schema/cart.schema";
import {productImageTable, productTable} from "@/db/schema/product.schema";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {GetCartItemsResponse} from "@/types/dto/response/cart.actions.response";
import {getOrCreateCartId} from "@/api/services/cart.service";

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
        quantity: sql`${cartItemTable.quantity}
        + 1`,
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

export const addItemToCart = async (
  productId: string,
  quantity: number,
): Promise<{ success: boolean; message: string }> => {
  try {
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

    const cartId = getOrCreateCartId(userId)

    // update cart
    await db
      .insert(cartItemTable)
      .values({
        cartId: cartId,
        productId: productInfo.id,
        quantity: quantity,
      })
      .onConflictDoUpdate({
        target: [cartItemTable.cartId, cartItemTable.productId],
        set: {quantity: quantity},
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
        quantity: sql`${cartItemTable.quantity}
        -1`,
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


export const getCartItems = async (): Promise<GetCartItemsResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session === null || session.user.isAnonymous) {
      redirect("/signin?error=signin_required")
    }
    const userId = session.user.id;

    const res = await db.select({
      productId: productTable.id,
      slug: productTable.slug,
      name: productTable.name,
      imageUrl: productImageTable.url,
      quantity: cartItemTable.quantity,
      priceInTax: productTable.priceInTax,
    })
      .from(cartTable)
      .where(and(
        eq(cartTable.userId, userId),
        eq(productImageTable.displayOrder, 0)
      ))
      .leftJoin(cartItemTable, eq(cartTable.id, cartItemTable.cartId))
      .leftJoin(productTable, eq(cartItemTable.productId, productTable.id))
      .leftJoin(productImageTable, eq(productImageTable.productId, productTable.id))

    if (res === undefined) {
      return {
        success: false,
        message: "data not found",
        data: []
      }
    }

    return {
      success: true,
      data: res
    }
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    return {
      success: false,
      message: "internal error",
      data: []
    }
  }
};
