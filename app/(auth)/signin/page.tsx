import {Metadata} from "next";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {SigninForm} from "@/app/(auth)/signin/signin-form";
import {authClient} from "@/lib/auth-client";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In"
}

const SignInPage = async (
    props: {
      searchParams: Promise<{
        callbackUrl: string
      }>
    }
) => {
  const { callbackUrl } = await props.searchParams;

  const session = await authClient.getSession();
  console.log(session)
  if (session.data) {
    // TODO: check safety..
    redirect(callbackUrl || "/")
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
            <SigninForm/>
          </CardContent>
        </Card>
      </div>
  )
};
export default SignInPage;