import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { SignUpForm } from "@/app/(auth)/signup/signup-form";
import { redirect } from "next/navigation";
import { sanitizePath } from "@/lib/utils/sanitize-url";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callback: string;
  }>;
}) => {
  const { callback } = await props.searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session && !session.user.isAnonymous) {
    redirect(sanitizePath(callback));
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex justify-center">
            <Image
              src="/images/logo.svg"
              width={100}
              height={100}
              alt="home image"
              priority
            />
          </Link>
          <CardTitle className="text-center">サインアップ</CardTitle>
          <CardDescription className="text-center">
            アカウントを登録してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};
export default SignUpPage;
