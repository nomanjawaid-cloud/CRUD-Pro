"use client";

import { useAuth } from "./AuthProvider";
import UserNavbar from "./userNavbar";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation"; // Import usePathname

export default function NavbarSwitcher() {
  const { token, isLoading } = useAuth(); // Get isLoading from useAuth
  const pathname = usePathname(); // Get current pathname

  // Show a loading state while AuthProvider is checking the token
  if (isLoading) {
    return (
      <nav className="w-full bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold tracking-wide">
          CRUD<span className="text-orange-400">Pro</span>
        </div>
        <div>Loading Navigation...</div>
      </nav>
    );
  }

  // Determine if it's an authentication route
  const isAuthRoute = pathname.startsWith("/auth");

  // If on an auth route and not logged in, show UserNavbar
  if (isAuthRoute && !token) {
    return <UserNavbar />;
  }

  // Otherwise (logged in, or not an auth route), show the main Navbar
  return <Navbar />;
}



