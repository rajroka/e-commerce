import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Top from "@/components/Top";
import Toastcontainer from "@/components/Toast";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GG Shop",
  description: "Premium quality products — GG Shop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
      
        <Toastcontainer />

        <Top />
        {children}
        
      
      </body>
    </html>
  );
}
