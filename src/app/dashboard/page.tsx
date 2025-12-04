"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { User, FileText, Menu } from "lucide-react";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      router.push("/auth/login");
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-gray-200 flex flex-col">
      <div className="absolute top-6 left-6 z-50 mb-8">
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger asChild>
            <Button
              className="
                bg-blue-500
                hover:bg-orange-600 
                text-black
                font-semibold 
                px-4 
                py-2 
                rounded-xl 
                shadow-md 
                border border-orange-300
                transition-all
                flex items-center gap-2
              "
            >
              <Menu className="w-6 h-6" />
              Menu
            </Button>
          </SheetTrigger>

          {/* SIDE MENU CONTENT */}
          <SheetContent side="left" className="w-80 p-6">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">Navigation</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 mt-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/users")}
                className="w-full justify-start gap-2"
              >
                <User className="w-5 h-5" />
                Users
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push("/posts")}
                className="w-full justify-start gap-2"
              >
                <FileText className="w-5 h-5" />
                Posts
              </Button>

              <Separator className="my-4" />

              <Button
                variant="outline"
                onClick={() => alert("Feature coming soon!")}
                className="w-full"
              >
                Settings
              </Button>

              <Button
                onClick={() => {
                  logout();
                  router.push("/auth/login");
                }}
                className="
                  w-full 
                  bg-red-500 
                  hover:bg-red-600 
                  text-white 
                  font-semibold 
                  rounded-xl 
                  mt-20 
                  shadow-md 
                  transition
                "
              >
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-between p-6 md:p-12 gap-12">
        <div className="flex-1 flex flex-col items-start gap-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-lg">
            Welcome
          </h1>

          <p className="text-lg text-gray-900 font-bold">
            Manage your users and posts effortlessly with a smooth and secure
            workflow.
            <br />
            CRUD Pro helps you organize data quickly, efficiently, and
            professionally.
          </p>

          {/* 
          <div className="flex flex-wrap gap-4 mt-4">
            <Button
              onClick={() => router.push("/users")}
              className="bg-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
            >
              Add User
            </Button>

            <Button
              onClick={() => router.push("/posts")}
              className="bg-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 transition"
            >
              Add Post
            </Button>
          </div> */}
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex-1 relative w-full max-w-lg h-[450px] md:h-[600px] shadow-2xl rounded-3xl overflow-hidden border border-gray-200 transform hover:scale-105 transition-transform duration-500">
          <Image
            src="/mainpic.png"
            alt="Dashboard Preview"
            width={600}
            height={450}
            className="object-cover object-center"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
