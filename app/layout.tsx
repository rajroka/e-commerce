import type { Metadata } from "next";
import { Geist, Geist_Mono  , Inter } from "next/font/google";
import "./globals.css";
import Top from "@/components/Top";
import Nav from "@/components/Nav";
import { Provider } from "react-redux";
import store, { persistor } from "@/redux/store";
import ReduxProvider from "@/redux/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight:['500','600','700','800']
});

export const metadata: Metadata = {
  title: "blog ",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${inter.variable} antialiased`}

      >
        <ReduxProvider>
        
        <Top  />
        <Nav/>
        {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
