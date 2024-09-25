import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "./_components";

export const metadata: Metadata = {
  title: "Liam",
  description: "Liam blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
