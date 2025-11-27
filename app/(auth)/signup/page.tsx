import {Metadata} from "next";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {SignUpForm} from "@/app/(auth)/signup/signup-form";
import {authClient} from "@/lib/auth-client";
import {redirect} from "next/navigation";
import {sanitizePath} from "@/utils/sanitize-url";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign Up"
}

const SignUpPage = async (
    props: {
      searchParams: Promise<{
        callback: string
      }>
    }
) => {
  const { callback } = await props.searchParams;

  const session = await auth.api.getSession();
  if (session) {
    // TODO: check safety..
    redirect(sanitizePath(callback))
  }
  return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-4">
            <Link href="/" className="flex justify-center">
              <Image src="/images/logo.svg" width={100} height={100} alt="home image" priority/>
            </Link>
            <CardTitle className="text-center">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center">
              register your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignUpForm/>
          </CardContent>
        </Card>
      </div>
  )
};
export default SignUpPage;