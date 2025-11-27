import {Metadata} from "next";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {SignInForm} from "@/app/(auth)/signin/sign-in-form";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {sanitizePath} from "@/utils/sanitize-url";

export const metadata: Metadata = {
  title: "Sign In"
}

const SignInPage = async (
    props: {
      searchParams: Promise<{
        callback: string
      }>
    }
) => {
  const { callback } = await props.searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
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
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignInForm/>
          </CardContent>
        </Card>
      </div>
  )
};
export default SignInPage;