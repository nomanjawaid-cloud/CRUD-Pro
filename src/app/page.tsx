<<<<<<< HEAD
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Page() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return null;
}
=======
import Image from "next/image";
import LoginPage from "./auth/LogIn/page";
import UserForm from "./auth/Register/page";
// import CreateUser from "./Users/page";
import DashboardPage from "./Dashboard/page";

function page() {
  return (
    <div>
      <Image
        src="/main-img.png"
        alt="main image"
        width={1200}
        height={600}
        className="w-full h-full object-cover"
      />

      <UserForm />
      <DashboardPage /> 
      <LoginPage />
      {/* <CreateUser /> */}
    </div>
  );
}

export default page;
>>>>>>> 5b153432a8cf93555228965e03da156b44a753a8
