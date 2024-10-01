import type { Metadata } from "next";
import "../styles/globals.css";
import { Header, Footer } from "../components";

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
        <main>
          {children}
        </main>
        <Footer></Footer>
      </body>
    </html>
  );
}
