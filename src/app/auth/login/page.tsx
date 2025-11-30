"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Generic Input Handler
  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        
        body: JSON.stringify({
          username: formData.email, // DummyJSON username chahta hai, isliye map kar diya
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      console.log("Login Response:", data);
      alert("Login Successful!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-gray-200 shadow rounded">
        <h1 className="text-3xl font-bold mb-4 text-center">Log In</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* EMAIL */}
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />

          {/* PASSWORD */}
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Dont have an account?
              <Link
                href="/auth/register"
                className="text-black underline hover:text-blue-900 ml-1"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
