import Link from "next/link";
import {auth} from "@/lib/auth";
import {authClient} from "@/lib/auth-client";
import {Button} from "@/components/ui/button";
import {UserIcon} from "lucide-react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import {signOutUser} from "@/actions/user.actions";

export const UserButton = async ()  => {
  const session = await authClient.getSession();
  if (!session.data) {
    return (
        <Button asChild variant={"outline"}>
          <Link href="/signin">
            <UserIcon/> SignIn
          </Link>
        </Button>
    )
  }

  const firstInitial = session.data.user?.name.charAt(0).toUpperCase() ?? "U";


  return (
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div>
              <Button
                  variant={"ghost"}
                  className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-300"
              >
                {firstInitial}
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <div>
                <div>
                  {session.data?.user?.name}
                </div>
                <div>
                  {session.data?.user?.email}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <form action={signOutUser}>
                <Button variant="ghost">
                  Sign out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  )
}

