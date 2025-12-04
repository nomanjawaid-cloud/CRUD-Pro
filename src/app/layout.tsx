import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import NavbarSwitcher from "@/components/NavbarSwitcher";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "User Management System",
  description: "User and Post management system with authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        suppressHydrationWarning={true}   // ✅ fixes mismatch
      >
        <AuthProvider>
          <NavbarSwitcher />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
