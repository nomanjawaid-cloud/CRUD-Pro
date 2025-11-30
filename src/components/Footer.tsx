import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-6 mt-10 shadow-xl relative z-20 bg-gray-800 text-white">
      <div className="container mx-auto text-center">
        <div className="text-2xl font-bold tracking-wide">
          <Link href="/" className="hover:text-gray-300 transition">
            CRUD<span className="text-orange-400">Pro</span>
          </Link>
        </div>

        <div className="mx-auto mt-2 mb-4 h-1 w-24 rounded-full bg-orange-400"></div>

        <div className="w-full py-4 text-center font-medium text-gray-400">
          © 2025 Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
