"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Footer from "@/components/Footer";

// ------------------------------
// ⭐ TYPES
// ------------------------------
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive";
  image?: string;
  createdAt?: string;
}

interface Filters {
  name: string;
  email: string;
  status: string;
  from: string;
  to: string;
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  image: File | null;
  status: "active" | "inactive";
}

interface EditUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: "active" | "inactive";
}

// ------------------------------
// 🔗 ALL API URLs
// ------------------------------
const GET_USERS_API = "https://your-backend.com/api/users";
const CREATE_USER_API = "https://your-backend.com/api/users/create";
const UPDATE_USER_API = "https://your-backend.com/api/users/update";
const DELETE_USER_API = "https://your-backend.com/api/users/delete";
const ACTIVE_USERS_API = "https://your-backend.com/api/users/active";

// ------------------------------
// ⭐ COMPONENT START
// ------------------------------
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  const [filters, setFilters] = useState<Filters>({
    name: "",
    email: "",
    status: "",
    from: "",
    to: "",
  });

  const [newUser, setNewUser] = useState<NewUser>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
    status: "active",
  });

  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditUser>({});

  // ------------------------------
  // 📌 Load Users
  // ------------------------------
  const loadUsers = async () => {
    try {
      const res = await axios.get(GET_USERS_API, { params: filters });
      setUsers(res.data.data || res.data);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  // ------------------------------
  // 📌 Load Active Users
  // ------------------------------
  const loadActiveUsers = async () => {
    try {
      const res = await axios.get(ACTIVE_USERS_API);
      setActiveUsers(res.data.data || res.data);
    } catch (err) {
      console.log("Dropdown Error:", err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadActiveUsers();
  }, []);

  // ------------------------------
  // 📌 Create User (updated for image upload)
  // ------------------------------
  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", newUser.firstName);
      formData.append("lastName", newUser.lastName);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("status", newUser.status);

      if (newUser.image) {
        formData.append("image", newUser.image);
      }

      await axios.post(CREATE_USER_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("User Created Successfully");
      loadUsers();
    } catch (err) {
      console.log("Create Error:", err);
    }
  };

  // ------------------------------
  // 📌 Update User
  // ------------------------------
  const handleUpdate = async () => {
    try {
      await axios.put(`${UPDATE_USER_API}/${editUserId}`, editData);
      alert("User Updated Successfully");
      setEditUserId(null);
      loadUsers();
    } catch (err) {
      console.log("Update Error:", err);
    }
  };

  // ------------------------------
  // 📌 Delete User
  // ------------------------------
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;

    try {
      await axios.delete(`${DELETE_USER_API}/${id}`);
      alert("User Deleted Successfully");
      loadUsers();
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };
  console.log(UsersPage);

  // ------------------------------
  // ⭐ UI START
  // ------------------------------
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* ------------------ */}
      {/* ⭐ Create User Form */}
      {/* ------------------ */}
      <div className="bg-white shadow p-6 rounded-xl mb-10">
        <h2 className="text-xl font-bold mb-4">Create User</h2>

        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="border p-2 rounded"
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Last Name"
            className="border p-2 rounded"
            onChange={(e) =>
              setNewUser({ ...newUser, lastName: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 rounded"
            onChange={(e) =>
              setNewUser({ ...newUser, confirmPassword: e.target.value })
            }
          />

          {/* ⭐ NEW IMAGE FIELD ADDED HERE */}
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded"
            onChange={(e) =>
              setNewUser({ ...newUser, image: e.target.files?.[0] || null })
            }
          />

          <select
            className="border p-2 rounded"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                status: e.target.value as "active" | "inactive",
              })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="col-span-2 bg-blue-600 text-white p-3 rounded-3xl">
            Create User
          </button>
        </form>
      </div>

      {/* ------------------ */}
      {/* ⭐ Filters Section */}
      {/* ------------------ */}
      <div className="bg-white shadow p-6 rounded-xl mb-10">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />

          <select
            className="border p-2 rounded"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />

          <input
            type="date"
            className="border p-2 rounded"
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>

        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-3xl"
          onClick={loadUsers}
        >
          Apply Filters
        </button>
      </div>

      {/* ------------------ */}
      {/* ⭐ Users Table */}
      {/* ------------------ */}
      <div className="bg-white shadow p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Users List</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u: User) => (
              <tr key={u.id} className="border">
                <td className="p-3">
                  {u.firstName} {u.lastName}
                </td>
                <td className="p-3">{u.email}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      u.status === "active" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => {
                      setEditUserId(u.id);
                      setEditData(u);
                    }}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ------------------ */}
      {/* ⭐ Edit User Popup */}
      {/* ------------------ */}
      {editUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <input
              type="text"
              className="border w-full p-2 rounded mb-3"
              value={editData.firstName || ""}
              onChange={(e) =>
                setEditData({ ...editData, firstName: e.target.value })
              }
            />

            <input
              type="text"
              className="border w-full p-2 rounded mb-3"
              value={editData.lastName || ""}
              onChange={(e) =>
                setEditData({ ...editData, lastName: e.target.value })
              }
            />

            <select
              className="border w-full p-2 rounded mb-3"
              value={editData.status || "active"}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  status: e.target.value as "active" | "inactive",
                })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white p-3 rounded mb-3"
            >
              Update
            </button>

            <button
              onClick={() => setEditUserId(null)}
              className="w-full bg-gray-600 text-white p-3 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}
