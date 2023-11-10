import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopMenu from "@/components/TopMenu";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "University Canteen",
  description: "The website for showing all vendor in university's canteens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopMenu />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
