import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function Dashboard() {
  return (
    <div>
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
        <p className="mb-6 text-center">Welcome to CRUD Pro dashboard.</p>

        {/* Image Section */}
        <div className="flex justify-center mb-6">
          <Image
            src="/mainpic.png"
            alt="Dashboard Preview"
            width={650}
            height={700}
            className="rounded-xl shadow"
          />
        </div>

        <div className="flex text-center justify-center gap-4">
          <Link
            href="/users"
            className="bg-blue-500 px-4 py-2 rounded-3xl hover:bg-blue-600 transition"
          >
            Manage Users
          </Link>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
