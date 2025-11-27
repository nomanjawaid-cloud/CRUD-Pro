"use client";

import { FaUsers, FaUserPlus, FaListUl } from "react-icons/fa";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-primary-600 p-6 flex flex-col">
      {/* Top Header */}
      <header className="bg-[#5A6F8F] text-white py-5 px-8 rounded-2xl shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button className="bg-[#FF912F] px-5 py-2 rounded-xl shadow hover:scale-105 transition-all font-semibold text-white">
          Logout
        </button>
      </header>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Total Users Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl text-[#2A385B] hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-4">
            <FaUsers size={40} className="text-[#FF912F]" />
            <div>
              <h2 className="text-xl font-bold">Total Users</h2>
              <p className="text-3xl font-extrabold mt-2">128</p>
            </div>
          </div>
        </div>

        {/* Add New User Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl text-[#2A385B] hover:scale-[1.02] transition-all cursor-pointer">
          <div className="flex items-center gap-4">
            <FaUserPlus size={40} className="text-[#FF912F]" />
            <div>
              <h2 className="text-xl font-bold">Add User</h2>
              <p className="text-sm mt-1 text-gray-600">
                Create a new user account
              </p>
            </div>
          </div>
        </div>

        {/* View All Users Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl text-[#2A385B] hover:scale-[1.02] transition-all cursor-pointer">
          <div className="flex items-center gap-4">
            <FaListUl size={40} className="text-[#FF912F]" />
            <div>
              <h2 className="text-xl font-bold">View Users</h2>
              <p className="text-sm mt-1 text-gray-600">
                Show list of all registered users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (Charts / Tables) */}
      <div className="mt-10 bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-[#2A385B]">Recent Users</h2>
        <p className="text-gray-600 mb-6">Latest added users</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#5A6F8F] text-white text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">John Doe</td>
                <td className="p-3">john@example.com</td>
                <td className="p-3 text-green-600 font-semibold">Active</td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Sarah Khan</td>
                <td className="p-3">sarah@example.com</td>
                <td className="p-3 text-yellow-500 font-semibold">Pending</td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Ali Ahmad</td>
                <td className="p-3">ali@example.com</td>
                <td className="p-3 text-green-600 font-semibold">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
