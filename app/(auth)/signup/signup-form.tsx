"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInDefaultValue } from "@/lib/constants";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { signUpUser } from "@/actions/user.actions";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  // TODO: need security fix...
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback") || "/";
  console.log("callback is ", callbackUrl)

  useEffect(() => {
    if (data && !data.success && data.message) {
      toast.error(data.message);
    }
  }, [data]);

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full " variant="default">
        {pending ? "登録中 ..." : "登録"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <div className="flex justify-between">
            <Label htmlFor="name">ユーザー名</Label>
            <div>
              {data?.errors?.name && (
                <p className="text-destructive">
                  *{data.errors.name.join(". ")}.
                </p>
              )}
            </div>
          </div>

          <Input
            id="name"
            name="name"
            type="name"
            required
            autoComplete="name"
            defaultValue=""
          />
        </div>
        <div>
          <div className="flex justify-between">
            <Label htmlFor="email">Eメール</Label>
            <div>
              {data?.errors?.email && (
                <p className="text-destructive">
                  *{data.errors.email.join(". ")}.
                </p>
              )}
            </div>
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValue.email}
          />
        </div>
        <div>
          <div className="flex justify-between">
            <Label htmlFor="password">パスワード</Label>
            <div>
              {data?.errors?.password && (
                <p className="text-destructive">
                  *{data.errors.password.join(". ")}.
                </p>
              )}
            </div>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValue.password}
          />
        </div>
        <div>
          <div className="flex flex-col">
            <Label htmlFor="confirmPassword">パスワード再入力</Label>
            {data?.errors?.confirmPassword && (
              <p className="text-destructive">
                *{data.errors.confirmPassword.join(". ")}.
              </p>
            )}
          </div>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue={signInDefaultValue.password}
          />
        </div>
        <div>
          <SignUpButton />
        </div>
        <div className="text-sm text-center text-muted-foreground">
          アカウントをお持ちですか?{" "}
          <Link href="/signin" className="underline">
            ログイン
          </Link>
        </div>
      </div>
    </form>
  );
};
