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
import {getOrCreateCartId} from "@/api/utils/cart.infra";
import {isRedirectError} from "next/dist/client/components/redirect-error";

export const addOneItemToCart = async (productId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session === null) {
      return {
        success: false,
        message: "ユーザーが見つかりません。ログインしてください。",
      };
    }

    const carts = await db.select({
      cartId: cartTable.id,
    }).from(cartTable).where(eq(cartTable.userId, session.user.id)).limit(1)
    if (carts.length === 0) {
      return {
        success: false,
        message: "カートが見つかりませんでした",
      };
    }

    const cartItemAndProductInfo = await db.select({
      quantity: cartItemTable.quantity,
      stock: productTable.stock,
    }).from(cartItemTable)
      .where(
        and(
          eq(cartItemTable.cartId, carts[0].cartId),
          eq(cartItemTable.productId, productId),
        )
      )
      .innerJoin(productTable, eq(cartItemTable.productId, productTable.id))
      .limit(1)
    console.log(cartItemAndProductInfo)
    if (cartItemAndProductInfo.length === 0) {
      return {
        success: false,
        message: "カートに該当の商品がありません",
      };
    }

    if (cartItemAndProductInfo[0].quantity + 1 > cartItemAndProductInfo[0].stock) {
      return {
        success: false,
        message: "商品の数が在庫数を超えてしまいます",
      };
    }

    await db
      .update(cartItemTable)
      .set({
        quantity: sql`${cartItemTable.quantity}+ 1`,
      })
      .where(and(
        eq(cartItemTable.cartId, carts[0].cartId),
        eq(cartItemTable.productId, productId),
      ));

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

    const cartId = await getOrCreateCartId(userId)

    // update cart
    await db
      .insert(cartItemTable)
      .values({
        cartId: cartId,
        productId: productId,
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
    if (isRedirectError(error)) throw error;
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
      .where(and(
        eq(cartItemTable.productId, productId),
        eq(cartItemTable.cartId, cart.id)
      ));

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
      redirect("/signin")
    }
    const userId = session.user.id;

    const res = await db.select({
      productId: productTable.id,
      slug: productTable.slug,
      name: productTable.name,
      imageUrl: productImageTable.url,
      quantity: cartItemTable.quantity,
      priceInTax: productTable.priceAfterTax,
    })
      .from(cartTable)
      .where(and(
        eq(cartTable.userId, userId),
        eq(productImageTable.displayOrder, 0)
      ))
      .innerJoin(cartItemTable, eq(cartTable.id, cartItemTable.cartId))
      .innerJoin(productTable, eq(cartItemTable.productId, productTable.id))
      .innerJoin(productImageTable, eq(productImageTable.productId, productTable.id))

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
    if (isRedirectError(error)) throw error;
    console.error("Failed to fetch cart items:", error);
    return {
      success: false,
      message: "internal error",
      data: []
    }
  }
};
