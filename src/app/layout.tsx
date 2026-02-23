import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import { SideMenuProvider } from "@/providers/sideMenu.provider";

export const metadata: Metadata = {
  title: "Voice to text",
  description: "Voice to text"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel='icon' href='./favicon.ico' sizes='any' />
      </Head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <SideMenuProvider>
          <ClerkProvider>
            <ToastContainer
              className={"text-sm font-white font-med block p-3"}
              position="bottom-left"
              autoClose={4000} />
            {children}
          </ClerkProvider>
        </SideMenuProvider>
      </body>
    </html>
  );
}
