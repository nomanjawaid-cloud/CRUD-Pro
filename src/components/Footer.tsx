import Link from "next/link";
export default function Footer() {
  return (
    <footer className="p-6 mt-10 shadow-xl relative z-20 bg-[#E3E3E3]">
      <div className="container mx-auto text-center">
        <div className="text-2xl font-bold tracking-wide">
          <Link href="/">
            CRUD<span className="text-[#FF912F]">Pro</span>
          </Link>
        </div>

        <div className="mx-auto mt-2 mb-4 h-1 w-24 rounded-full bg-[#FF912F]"></div>

        <div className="w-full py-4 text-center font-medium text-[#2A385B]">
          © 2025 Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
