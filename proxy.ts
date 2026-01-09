import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { isPublicRoute } from "@/lib/utils";

const publicRoutes = ["/", "/product", "/signin", "/signup"]

export const proxy = (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request)
  const pathName = request.nextUrl.pathname


  if (!sessionCookie && !isPublicRoute(pathName, publicRoutes)) {
    const url = new URL("/signin", request.nextUrl)
    url.searchParams.set("callback", pathName)
    console.log("proxy worked")

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|favicon.ico|_next/image|images|.*\\.png$).*)',
  ]
}