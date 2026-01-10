"use server";

import {addressTable} from "@/db/schema/address.schema";
import {auth} from "@/lib/auth/auth";
import {shippingAddressSchema} from "@/zod/shipping-address.zod";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {z} from "zod";
import {headers} from "next/headers";
import {RegisterShippingAddrResponse} from "@/types/dto/request/addr.actions.response";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {redirect} from "next/navigation";

export const registerShippingAddr = async (
  prevState: RegisterShippingAddrResponse,
  formData: FormData,
): Promise<RegisterShippingAddrResponse> => {
  console.log("received", formData);
  const rawData = {
    lastName: formData.get("lastName") as string,
    firstName: formData.get("firstName") as string,
    postalCodeFirst: formData.get("postalCodeFirst") as string,
    postalCodeLast: formData.get("postalCodeLast") as string,
    prefecture: formData.get("prefecture") as string,
    city: formData.get("city") as string,
    street: formData.get("street") as string,
    building: formData.get("building") as string,
  }
  const res = shippingAddressSchema.safeParse(rawData);
  if (!res.success) {
    console.log(res.error);
    return {
      success: false,
      message: "不正な入力値を検出",
      fieldData: rawData,
      formErrors: z.flattenError(res.error).formErrors,
      fieldErrors: z.flattenError(res.error).fieldErrors
    };
  }

  const parsedAddr = res.data;
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

    await db.transaction(async (tx) => {
      await tx.update(addressTable)
        .set({isDefault: false})
        .where(eq(addressTable.userId, userId));

      const postalCode = parsedAddr.postalCodeFirst + parsedAddr.postalCodeLast;
      await tx.insert(addressTable)
        .values({
          firstName: parsedAddr.firstName,
          lastName: parsedAddr.lastName,
          userId: userId,
          postalCode: postalCode,
          prefecture: parsedAddr.prefecture,
          city: parsedAddr.city,
          street: parsedAddr.street,
          building: parsedAddr.building,
          isDefault: true,
        })
    })

    redirect("/payment")

  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "不正な入力値を確認しました"
      }
    }
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
