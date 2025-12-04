<<<<<<< HEAD
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import NavbarSwitcher from "@/components/NavbarSwitcher";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "User Management System",
  description: "User and Post management system with authentication",
=======
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRUDPro - Professional CRUD Application",
  description: "A professional CRUD application built with Next.js",
>>>>>>> 5b153432a8cf93555228965e03da156b44a753a8
};

export default function RootLayout({
  children,
<<<<<<< HEAD
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
=======
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto p-4">
              {children}
            </main>
          </div>
          <Footer/>
        </ThemeProvider>

>>>>>>> 5b153432a8cf93555228965e03da156b44a753a8
      </body>
    </html>
  );
}
