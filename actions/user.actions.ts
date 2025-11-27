"use server";

import {signInFormSchema, signUpFormSchema} from "@/zod/user.zod";
import { auth } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {headers} from "next/headers";
import {z} from "zod";
import {APIError} from "better-auth/api";
import {redirect} from "next/navigation";

export const signInWithCredentials = async (
  prevState: {success: boolean, message: string} | null,
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
        callbackURL: process.env.NEXT_PUBLIC_SERVER_URL
      },
      headers: await headers(),
    });

    return { success: true, message: "signed in successfully.." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" };
  }
};

// sign user out.
export const signOutUser = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/")
};


export type SignUpState = {
  success: boolean;
  message?: string;
  fields?: Record<string, string>;
  errors?: Record<string, string[]>;
}

export const signUpUser = async (
    previousState: unknown, formData: FormData,
): Promise<SignUpState> => {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    await auth.api.signUpEmail({
      body: {
        name: user.name,
        email: user.email,
        password: user.password,
      }
    })

    return { success: true, message: "successfully created user"}
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: z.flattenError(error).fieldErrors,
      }
    }
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {success: false, message: JSON.stringify(error)}
  }
}