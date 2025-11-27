"use client";

import React, { useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

export default function UserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;

      const response = await fetch(
        "https://6925a8d682b59600d7249e98.mockapi.io/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Employee registered successfully!");
      handleCancel();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#4a5f7f]">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-4 rounded-xl text-white text-xl font-semibold transition-all duration-300 hover:scale-105 bg-[#FF912F] shadow-lg"
        >
          Register
        </button>
      ) : (
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
          <div className="relative px-8 py-6 flex items-center justify-between bg-[#5a6f8f]">
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            >
              <FaArrowLeft size={28} color="#FFFFFF" />
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2 px-12 py-3 rounded-xl text-white text-xl font-semibold bg-[#FF912F] shadow-md">
              User Form
            </div>

            <button
              onClick={handleCancel}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            >
              <FaTimes size={28} color="#FFFFFF" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* First Name */}
            <div>
              <label className="block mb-2 font-medium text-[#2A385B]">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-500 text-black transition-all duration-300 bg-white border-gray-300"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-2 font-medium text-[#2A385B]">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-500 text-black transition-all duration-300 bg-white border-gray-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium text-[#2A385B]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-500 text-black transition-all duration-300 bg-white border-gray-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium text-[#2A385B]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-500 text-black transition-all duration-300 bg-white border-gray-300"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 font-medium text-[#2A385B]">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-orange-500 text-black transition-all duration-300 bg-white border-gray-300"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 bg-[#2A385B] shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 bg-[#FF912F] shadow-md disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
