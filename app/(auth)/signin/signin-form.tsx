"use client";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {signInDefaultValue} from "@/lib/constants";
import Link from "next/link";
import {useActionState, useEffect} from "react";
import {signInWithCredentials} from "@/actions/user.actions";
import {useFormStatus} from "react-dom";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {useSearchParams} from "next/navigation";


export const SigninForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: ""
  })

  // TODO: need security fix...
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (data && !data.success && data.message) {
      toast.error(data.message);
    }
  }, [data]);

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button disabled={pending} className="w-full " variant="default">
          { pending ? "Signing In ..." : "SignIn"}
        </Button>
    )
  }

  return (
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl}/>
        <div className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
                id="email" name="email" type="email"
                required autoComplete="email"
                defaultValue={signInDefaultValue.email}
            />
          </div>
          <div>
            <Label htmlFor="email">Password</Label>
            <Input
                id="password" name="password" type="password"
                required autoComplete="password"
                defaultValue={signInDefaultValue.password}
            />
          </div>
          <div>
            <SignInButton/>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Don&#39;t have an account? {" "}
            <Link href="/signup" className="underline">
              Sign Up
            </Link>
          </div>
        </div>
      </form>
  )
}