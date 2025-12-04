"use client";

import { useState } from "react";
import { MdMailOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("Login Response:", data);
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-200">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-xl shadow-xl w-full max-w-md space-y-6 bg-white"
      >
        <h2
          className="text-3xl font-bold text-center bg-primaryBlue "
          // style={{ color: "#2A385B" }}
        >
          Login in to your Account
        </h2>

        {/* Email */}
        <div>
          <label
            className="block mb-1 font-semibold"
            style={{ color: "#2A385B" }}
          >
            Email
          </label>

          <div className="relative">
            <MdMailOutline
              className="absolute left-3 top-3 text-xl"
              style={{ color: "#2A385B" }}
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-10 py-2 rounded-lg focus:outline-none text-black"
              style={{
                borderColor: "#2A385B",
              }}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            className="block mb-1 font-semibold"
            style={{ color: "#2A385B" }}
          >
            Password
          </label>

          <div className="relative">
            <CiLock
              className="absolute left-3 top-3 text-xl"
              style={{ color: "#2A385B" }}
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-10 py-2 rounded-lg focus:outline-none text-black"
              style={{
                borderColor: "#2A385B",
              }}
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg font-semibold"
          style={{
            backgroundColor: "#2A385B",
            color: "#FFFFFF",
          }}
        >
          Login
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2 rounded-lg font-semibold mt-2"
          style={{
            backgroundColor: "#FF912F",
            color: "#FFFFFF",
          }}
        >
          Logout
        </button>
      </form>
    </div>
  );
}
