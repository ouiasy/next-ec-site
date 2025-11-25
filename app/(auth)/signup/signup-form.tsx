"use client";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {signInDefaultValue} from "@/lib/constants";
import Link from "next/link";
import {useActionState, useEffect} from "react";
import {signInWithCredentials} from "@/actions/user.actions";
import {useFormStatus} from "react-dom";
import { toast } from "sonner"
import {useSearchParams} from "next/navigation";


export const SignUpForm = () => {
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

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button disabled={pending} className="w-full " variant="default">
          { pending ? "Signing Up ..." : "SignUp"}
        </Button>
    )
  }

  return (
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl}/>
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
                id="name" name="name" type="name"
                required autoComplete="name"
                defaultValue=""
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
                id="email" name="email" type="email"
                required autoComplete="email"
                defaultValue={signInDefaultValue.email}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
                id="password" name="password" type="password"
                required autoComplete="password"
                defaultValue={signInDefaultValue.password}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
                id="confirmPassword" name="confirmPassword" type="password"
                required autoComplete="confirmPassword"
                defaultValue={signInDefaultValue.password}
            />
          </div>
          <div>
            <SignUpButton/>
          </div>
          <div className="text-sm text-center text-muted-foreground">
             Already have an account? {" "}
            <Link href="/signin" className="underline">
              Sign In
            </Link>
          </div>
        </div>
      </form>
  )
}