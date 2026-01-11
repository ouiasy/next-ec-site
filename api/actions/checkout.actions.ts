"use server"

import {auth} from "@/lib/auth";
import {cookies, headers} from "next/headers";
import {redirect} from "next/navigation"
import {db} from "@/db"
import {orderItemsTable, orderTable} from "@/db/schema/order.schema";
import {cartItemTable, cartTable} from "@/db/schema/cart.schema";
import {eq, sql, TransactionRollbackError} from "drizzle-orm";
import {productTable} from "@/db/schema/product.schema";
import {isRedirectError} from "next/dist/client/components/redirect-error";


export const checkOutAction = async () => {
  console.log("checkout action called")
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null) {
      redirect("/signin?callback=/cart")
    }

    const userID = session.user.id

    const orderID = await db.transaction(async (tx) => {
      const cart = await tx.select({
        id: cartTable.id,
        productID: productTable.id,
        productName: productTable.name,
        priceBeforeTax: productTable.priceBeforeTax,
        priceAfterTax: productTable.priceAfterTax,
        taxRate: productTable.taxRatePercentage,
        stock: productTable.stock,
        quantity: cartItemTable.quantity,
      })
        .from(cartTable)
        .where(eq(cartTable.userId, userID))
        .innerJoin(cartItemTable, eq(cartItemTable.cartId, cartTable.id))
        .innerJoin(productTable, eq(productTable.id, cartItemTable.productId))
        .limit(1)

      if (cart.some(item => item.stock < item.quantity)) {
        tx.rollback()
      }

      // reduce stock in parallel
      const updatePromises = cart.map(async item =>
        await tx.update(productTable).set({
          stock: sql`${productTable.stock} - ${item.quantity}`
        }).where(eq(productTable.id, item.productID))
      )

      await Promise.all(updatePromises)

      const totalPrices = cart.reduce((sum, item) => ({
        subTotal: sum.subTotal + item.priceBeforeTax * item.quantity,
        tax: sum.tax + (item.priceAfterTax - item.priceBeforeTax)* item.quantity,
      }), {
        subTotal: 0,
        tax: 0,
      })

      const priceBeforeShippingFee = totalPrices.subTotal + totalPrices.tax
      const shippingFee = calculateShippingFee(priceBeforeShippingFee)
      const grandTotal = priceBeforeShippingFee + shippingFee

      const orderInfo = await tx.insert(orderTable).values({
        userId: userID,
        itemsSubtotal: totalPrices.subTotal,
        shippingFee: shippingFee,
        taxTotal: totalPrices.tax,
        grandTotal: grandTotal,
        // orderStatus = pending(default)
      }).returning({
        orderID: orderTable.id
      })


      const orderItems = cart.map(item => {
        return {
          orderId: orderInfo[0].orderID,
          productId: item.productID,
          productName: item.productName,
          priceExTax: item.priceBeforeTax,
          taxRate: item.taxRate,
          quantity: item.quantity,
        }
      })

      await tx.insert(orderItemsTable)
        .values(orderItems)

      //delete cart
      await tx.delete(cartTable)
        .where(eq(cartTable.id, cart[0].id))

      return orderInfo[0].orderID
    })

    const cookieStore = await cookies()
    cookieStore.set({
      name: "order_id",
      value: orderID,
      httpOnly: true,
      path: "/",
    })

    redirect("/shipping")

  } catch (e) {
    if (isRedirectError(e)) throw e;
    if (e instanceof TransactionRollbackError) {
      return {
        success: false,
        message: "error while doing transaction"
      }
    }
    console.log(e)
    return {
      success: false,
      message: "unknown error"
    }

  }
}

const calculateShippingFee = (price: number): number => {
  // todo: define with env var
  if (price > 5_000) {
    return 0
  }
  return 500
}
