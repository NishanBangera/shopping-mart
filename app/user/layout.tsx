import Menu from "@/components/shared/header/menu";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./main-nav";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME!;
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b container mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link href="/" className="w-22">
              <Image
                src="/images/logo.svg"
                alt={NEXT_PUBLIC_APP_NAME}
                height={48}
                width={48}
              />
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Menu />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
            {children}
        </div>
      </div>
    </>
  );
}
