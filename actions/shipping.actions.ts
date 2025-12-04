"use server";

import { addressTable } from "@/db/schema/address.schema";
import { auth } from "@/lib/auth";
import { shippingAddressSchema } from "@/zod/shipping-address.zod";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import z from "zod";
import { headers } from "next/headers";

export const handleShippingAddr = async (
  addr: z.infer<typeof shippingAddressSchema>,
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session === null) {
      return {
        success: false,
        message: "ユーザー情報が見つかりません",
      };
    }
    const userId = session.user.id;
    await db
      .insert(addressTable)
      .values({
        name: addr.name,
        userId: userId,
        postalCode: addr.postalCode,
        prefecture: addr.prefecture,
        city: addr.city,
        street: addr.street,
        building: addr.building,
      })
      .onConflictDoUpdate({
        target: addressTable.userId,
        set: {
          name: addr.name,
          postalCode: addr.postalCode,
          prefecture: addr.prefecture,
          city: addr.city,
          street: addr.street,
          building: addr.building,
        },
      });

    return {
      success: true,
      message: "住所を登録しました。",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "住所の登録中にエラーが発生しました",
    };
  }
};

type FindShippingAddrResult = {
  success: boolean;
  message?: string;
  data?: typeof addressTable.$inferSelect;
};

export const findShippingAddr = async (): Promise<FindShippingAddrResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session === null) {
      return {
        success: false,
        message: "ユーザーが見つかりません",
      };
    }

    const userId = session.user.id;
    const address = await db.query.addressTable.findFirst({
      where: eq(addressTable.userId, userId),
    });
    if (address === undefined) {
    }
    console.log("get address", address);
    return {
      success: true,
      message: "住所が見つかりました",
      data: address,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "登録した住所の検索中にエラーが生じました",
    };
  }
};
