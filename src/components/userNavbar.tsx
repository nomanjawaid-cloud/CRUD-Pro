// "use client";

// import Link from "next/link";
// import { LogIn, UserPlus } from "lucide-react";

// export default function UserNavbar() {
//   return (
//     <nav className="w-full bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
//       <Link href="/" className="text-2xl font-extrabold tracking-wide">
//         CRUD<span className="text-orange-400 text-3xl"> Pro</span>
//       </Link>

//       <div className="flex items-center gap-4">
//         <Link
//           href="/auth/login"
//           className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2"
//         >
//           <LogIn className="w-4 h-4" />
//           Login
//         </Link>

//         <Link
//           href="/auth/register"
//           className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2"
//         >
//           <UserPlus className="w-4 h-4" />
//           Sign up
//         </Link>
//       </div>
//     </nav>
//   );
// }


"use client";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

export default function UserNavbar() {
  return (
    <nav className="w-full bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-extrabold tracking-wide">
        CRUD<span className="text-orange-400 text-3xl"> Pro</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/auth/login"
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" /> Login
        </Link>

        <Link
          href="/auth/register"
          className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Sign up
        </Link>
      </div>
    </nav>
  );
}
