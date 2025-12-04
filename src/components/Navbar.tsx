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
    </nav>
  );
}
