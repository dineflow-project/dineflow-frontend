import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopMenu from "@/components/TopMenu";
import { useAuth, AuthProvider } from "@/components/auth/AuthProvider";
import { useEffect } from "react";

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
  // const { isAuthenticated, user, loading } = useAuth();
  // // Use useEffect to reload the TopMenu component when the authentication state changes
  // useEffect(() => {
  //   // You can perform any additional actions here when the authentication state changes
  //   console.log(
  //     "Authentication state changed:",
  //     isAuthenticated,
  //     user,
  //     loading
  //   );
  // }, [isAuthenticated, user, loading]);
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* <TopMenu
            isAuthenticated={isAuthenticated}
            user={user}
            loading={loading}
          /> */}
          <TopMenu />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
