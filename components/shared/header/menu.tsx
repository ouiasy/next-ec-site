import { ModeToggle } from "@/components/shared/header/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton } from "@/components/shared/header/user-button";

export const Menu = () => {
  return (
    <div>
      <nav className="md:flex gap-4 hidden">
        <Button asChild variant={"ghost"}>
          <Link href="/cart">
            <ShoppingCart /> カート
          </Link>
        </Button>
        <UserButton />
        <ModeToggle />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <EllipsisVertical />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-5">
            <SheetHeader>
              <SheetTitle className="text-2xl">Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5 flex flex-col gap-4">
              <ModeToggle />
              <Button asChild variant="outline">
                <Link href="/cart">
                  <ShoppingCart />
                  <span>カート</span>
                </Link>
              </Button>
              <UserButton />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};
