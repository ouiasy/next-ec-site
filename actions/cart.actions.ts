"use server";

import {CartItemType} from "@/types/cart.type";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {carts} from "@/db/schema/cart.schema";

export const AddItemToCart = async (item: CartItemType): Promise<{ success: boolean, message: string }> => {
  // get session
  const session = await auth.api.getSession({
    headers: await headers()
  });
  let userId = session?.user.id;

  if (!userId) {
    const session = await auth.api.signInAnonymous({
      headers: await headers()
    })
    if (!session?.user) {
      return {
        success: false, message: "could not create anonymous user"
      }
    }
    userId = session?.user.id

    try {
      await db.insert(carts).values({
        userId: userId,
      });
    } catch (e) {
      return {
        success: false,
        message: "Failed to create new cart in DB."
      };
    }
  }


  try {
    const data = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        cartItems: true,
      }
    })

    return {
      success: true, message: "added to cart successfully."
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      success: false,
      message: errorMessage
    }
  }

}
