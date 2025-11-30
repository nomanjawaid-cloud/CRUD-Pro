// import Link from "next/link";
// import { LogOut } from "lucide-react";

// function Navbar() {
//   return (
//     <nav className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
//       {/* Logo */}{" "}
//       <Link href="/" className="text-2xl font-extrabold tracking-wide">
//         CRUD<span className="text-orange-400 text-3xl"> Pro</span>{" "}
//       </Link>
//       <div className="flex items-center gap-4">
//         <Link
//           href="/dashboard"
//           className="bg-blue-500 px-4 py-2 rounded hover:bg-orange-500 transition flex items-center gap-2"
//         >
//           Dashboard
//         </Link>
//         <Link
//           href="/users"
//           className="bg-blue-500 px-4 py-2 rounded hover:bg-orange-500 transition flex items-center gap-2"
//         >
//           Users
//         </Link>
//         <Link
//           href="/posts"
//           className="bg-blue-500 px-4 py-2 rounded hover:bg-orange-500 transition flex items-center gap-2"
//         >
//           Post
//         </Link>
//         {/* LogOut Button */}
//         <Link
//           href="/auth/logout"
//           className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition flex items-center gap-2"
//         >
//           <LogOut className="w-4 h-4" />
//           LogOut
//         </Link>
//       </div>
//     </nav>
//   );
// }
// export default Navbar;

"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { token, logout } = useAuth();

  // If no token → Pre Login Navbar
  if (!token) {
    return (
      <nav className="w-full bg-blue-800 text-white px-6 py-4 flex justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-wide">
          CRUD<span className="text-orange-400 text-3xl"> Pro</span>{" "}
        </Link>
        <div className="flex gap-4">
        
          <Link href="/auth/login">Login</Link>{" "}
          <Link href="/auth/register">Register</Link>{" "}
        </div>{" "}
      </nav>
    );
  }

  // If token exists → After Login Navbar
  return (
    <nav className="w-full bg-green-700 text-white px-6 py-4 flex justify-between">
      
      <Link href="/dashboard" 
      className="text-xl font-bold">
        Dashboard
      </Link>
      <div className="flex gap-4">
        <Link href="/users"
        >Users
        </Link>

        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
