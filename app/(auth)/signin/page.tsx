import {Metadata} from "next";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Sign In"
}

const SignInPage = () => {
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
              {/*      form here...*/}
              </CardContent>
          </Card>
      </div>
  )
};
export default SignInPage;