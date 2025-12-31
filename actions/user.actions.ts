"use server";

import { signInFormSchema, signUpFormSchema } from "@/zod/user.zod";
import { auth } from "@/lib/auth/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { z } from "zod";
import { APIError } from "better-auth/api";

export const signInWithCredentials = async (
  prevState: { success: boolean; message: string } | null,
  formData: FormData,
) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await auth.api.signInEmail({
      body: {
        email: user.email,
        password: user.password,
        callbackURL: process.env.NEXT_PUBLIC_SERVER_URL,
      },
      headers: await headers(),
    });

    return { success: true, message: "サインインに成功しました。" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "メールアドレスかパスワードが正しくありません",
    };
  }
};

// sign user out.
export const signOutUser = async (): Promise<{ success: boolean }> => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
    };
  }
};

export type SignUpResult = {
  success: boolean;
  message?: string;
  fields?: Record<string, string>;
  errors?: Record<string, string[]>;
};

export const signUpUser = async (
  previousState: unknown,
  formData: FormData,
): Promise<SignUpResult> => {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    await auth.api.signUpEmail({
      body: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      headers: await headers(),
    });

    return { success: true, message: "ユーザーの作成に成功しました" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: z.flattenError(error).fieldErrors,
      };
    }
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message,
      };
    }

    return { success: false, message: JSON.stringify(error) };
  }
};
