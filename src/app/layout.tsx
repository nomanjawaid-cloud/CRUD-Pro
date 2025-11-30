// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// import "./globals.css";
// import AuthProvider from "@/components/AuthProvider";
// import Navbar from "@/components/Navbar";

// export const metadata = {
// title: "My Next App",
// };

// export default function RootLayout({ children }) {
// return ( <html lang="en"> <body> <AuthProvider> <Navbar />
// {children} </AuthProvider> </body> </html>
// );
// }
// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });

// export const metadata: Metadata = {
//   title: "CRUD Management System",
//   description: "User and Post management system with authentication",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         <Navbar />
//         {children}
//         <Footer />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Metadata for the project
export const metadata: Metadata = {
  title: "CRUD Management System",
  description: "User and Post management system with authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider>
          <Navbar />
          {children}
         
        </AuthProvider>
      </body>
    </html>
  );
}
