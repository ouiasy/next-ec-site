"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInDefaultValue } from "@/lib/constants";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { signInWithCredentials } from "@/actions/user.actions";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizePath } from "@/lib/utils/sanitize-url";

export const SignInForm = () => {
  const router = useRouter();
  const [data, action] = useActionState(signInWithCredentials, null);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback") || "/";

  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success("ログインに成功しました");
        router.push(sanitizePath(callbackUrl));
      } else if (!data.success && data.message) {
        toast.error(data.message);
      }
    }
  }, [callbackUrl, data, router]);

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full " variant="default">
        {pending ? "ログイン中..." : "ログイン"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">E-メール</Label>
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
          <Label htmlFor="email">パスワード</Label>
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
          <SignInButton />
        </div>
        <div className="text-sm text-center text-muted-foreground">
          アカウントを持っていませんか?{" "}
          <Link href="/signup" className="underline">
            ユーザー登録
          </Link>
        </div>
      </div>
    </form>
  );
};
