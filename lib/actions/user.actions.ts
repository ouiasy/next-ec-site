"use server";

import { signInFormSchema } from "@/zod/user";
import { auth } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const signInWithCredentials = async (
  prevState: unknown,
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
export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
};
