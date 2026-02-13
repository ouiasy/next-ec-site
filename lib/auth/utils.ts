import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export const getSessOrRedirect = async (path: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session === null) {
    redirect(`/signin?callback=${path}`)
  }

  return session
}