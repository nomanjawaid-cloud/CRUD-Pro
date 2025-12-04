"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function Logout() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    logout();

    localStorage.removeItem("user");

    router.replace("/auth/login");

    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
