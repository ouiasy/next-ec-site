import Link from "next/link";
import {auth} from "@/lib/auth";
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
import {headers} from "next/headers";
import {LogoutButton} from "@/components/shared/header/logout-button";

export const UserButton = async ()  => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return (
        <Button asChild variant={"outline"}>
          <Link href="/signin">
            <UserIcon/> SignIn
          </Link>
        </Button>
    )
  }

  const firstInitial = session.user?.name.charAt(0).toUpperCase() ?? "U";

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
                  {session.user?.name}
                </div>
                <div className="text-muted-foreground">
                  {session.user?.email}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <LogoutButton/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  )
}

