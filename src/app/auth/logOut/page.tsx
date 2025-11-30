"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send token to backend
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Logout failed!");
        setLoading(false);
        return;
      }

      console.log("Logout Response:", data);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Redirect to login
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

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
