import Link from "next/link";
import {APP_NAME} from "@/lib/constants";
import Image from "next/image"
import {Menu} from "@/components/shared/header/menu"

const Header = () => {
    return (
        <header className="w-full border-b py-2">
            <div className="container mx-auto flex items-center justify-between px-3">
                <div className="flex mx-3 md:mx5">
                    <Link href="/" className="flex items-center" >
                        <Image src="/images/logo.svg" alt={`${APP_NAME} logo`} height={48} width={48} priority={true}/>
                        <span className="hidden ml-3 font-bold text-2xl lg:block">E-Commerce</span>
                    </Link>
                </div>
                <Menu/>
            </div>
        </header>
    );
};

export default Header;