"use client";
import React, {useActionState, useEffect} from 'react';
import {signOutUser} from "@/actions/user.actions";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export const LogoutButton = () => {
  const [data, action] = useActionState(signOutUser, null)
  const router = useRouter();

  useEffect(() => {
    if (data) {
      if (data?.success) {
        toast.success("logged out successfully")
        router.push("/")
        router.refresh()
      } else if (!data?.success) {
        toast.error("error while logging out")
      }
    }
  }, [data, router]);
  return (
      <form action={action}>
        <Button variant="ghost">
          Sign out
        </Button>
      </form>
  );
};
