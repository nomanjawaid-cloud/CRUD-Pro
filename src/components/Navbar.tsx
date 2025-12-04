<<<<<<< HEAD
// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "./AuthProvider";
// import { Button } from "./ui/button";
// import { Menu } from "lucide-react";

// export default function Navbar() {
//   const { token, logout } = useAuth();
//   const router = useRouter();

//   if (!token) return null; // render nothing if no token

//   return (
//     <nav className="w-full bg-blue-400 text-white px-6 py-4 flex justify-between">
//       <div className="absolute top-6 left-6 z-50">
//         <Button
//           className="
//       bg-orange-500
//       hover:bg-orange-600
//       text-white
//       font-semibold
//       px-4
//       py-2
//       rounded-xl
//       shadow-md
//       border border-orange-300
//       transition-all
//       flex items-center gap-2
//     "
//         >
//           <Menu className="w-6 h-6" />
//           Menu
//         </Button>
//       </div>

//       <Link href="/dashboard" className="text-xl font-bold ml-24">
//         <span className="text-white font-bold text-2xl">CRUD</span>{" "}
//         <span className="text-orange-500 font-extrabold text-2xl">-PRO</span>
//       </Link>
//       <div className="flex gap-4 ">
//         <Link href="/dashboard">Home</Link>
//         <Link href="/users">Users</Link>
//         <Link href="/posts">Posts</Link>
//         <button
//           onClick={() => {
//             logout();
//             router.push("/auth/login");
//           }}
//           className="bg-red-500 px-3 py-1 rounded"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { token, logout } = useAuth();
  const router = useRouter();

  if (!token) return null; // render nothing if no token

  return (
    <nav className="w-full bg-blue-400 text-white px-6 py-4 flex justify-between items-center">
      {/* Left side: Menu button */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-bold  ml-26">
          <span className="text-white font-bold text-4xl">CRUD</span>{" "}
          <span className="text-orange-500 font-extrabold text-4xl"> -PRO</span>
        </Link>
      </div>

      {/* Right side: Navigation links */}
      <div className="flex gap-6 items-center">
        <Link
          href="/dashboard"
          className="hover:text-orange-200 transition-colors"
        >
          Home
        </Link>
        <Link href="/users" className="hover:text-orange-200 transition-colors">
          Users
        </Link>
        <Link href="/posts" className="hover:text-orange-200 transition-colors">
          Posts
        </Link>
        <button
          onClick={() => {
            logout();
            router.push("/auth/login");
          }}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Logout
        </button>
      </div>
=======
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  toggleSidebar?: () => void;
  isLoggedIn?: boolean;
}

export default function Navbar({
  toggleSidebar,
  isLoggedIn = false,
}: NavbarProps) {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-[#2A385B] text-white shadow-md px-6 py-4 flex items-center justify-between relative">
      {/* Left Side – Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle */}
        {toggleSidebar && (
          <button className="md:hidden text-white mr-3" onClick={toggleSidebar}>
            <Menu size={26} />
          </button>
        )}

        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">
          <Link href="/">
            CRUD<span className="text-[#FF912F]">Pro</span>
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/dashboard" className="hover:text-[#FF912F] transition">
          Dashboard
        </Link>

        <Link href="/users" className="hover:text-[#FF912F] transition">
          Users
        </Link>

        <Link href="/posts" className="hover:text-[#FF912F] transition">
          Posts
        </Link>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#FF912F]/20 relative"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Login / Logout */}
        {!isLoggedIn ? (
          <Link
            href="/login"
            className="bg-[#FF912F] px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            Login
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2 bg-[#FF912F] hover:bg-[#e48025] text-white px-4">
                <User size={18} /> John Doe
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
        {open ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="absolute top-[4.2rem] left-0 w-full bg-[#2A385B] text-white flex flex-col gap-5 p-6 md:hidden shadow-lg">
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </Link>

          <Link href="/users" onClick={() => setOpen(false)}>
            Users
          </Link>

          <Link href="/posts" onClick={() => setOpen(false)}>
            Posts
          </Link>

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="bg-[#FF912F] px-4 py-2 rounded-md text-center"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          ) : (
            <button
              className="text-left text-red-400"
              onClick={() => setOpen(false)}
            >
              Logout
            </button>
          )}
        </div>
      )}
>>>>>>> 5b153432a8cf93555228965e03da156b44a753a8
    </nav>
  );
}
