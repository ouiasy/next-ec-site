import Header from "@/components/shared/header";
import Footer from "@/components/footer";
import {Toaster} from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto">
        {children}
        <Toaster
            position="top-center"
            richColors
            duration={5000}
        />
      </main>
      <Footer />
    </div>
  );
}
