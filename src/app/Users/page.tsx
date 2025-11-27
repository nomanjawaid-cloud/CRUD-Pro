// "use client";

// import { useState } from "react";

// export default function CreateUser() {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     status: "active",
//   });

//   const [image, setImage] = useState<File | null>(null);

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//     if (image) fd.append("image", image);

//     const res = await fetch("http://localhost:5000/api/users/create", {
//       method: "POST",
//       body: fd,
//     });

//     const data = await res.json();
//     console.log("User Create Response:", data);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100">
//       <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
//         <h2 className="text-2xl font-bold mb-4 text-center">Create User</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="font-semibold">First Name</label>
//               <input
//                 name="firstName"
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded-lg"
//                 required
//               />
//             </div>

//             <div>
//               <label className="font-semibold">Last Name</label>
//               <input
//                 name="lastName"
//                 onChange={handleChange}
//                 className="w-full border px-3 py-2 rounded-lg"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="font-semibold">Email</label>
//             <input
//               name="email"
//               type="email"
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-lg"
//               required
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Password</label>
//             <input
//               name="password"
//               type="password"
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-lg"
//               required
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Confirm Password</label>
//             <input
//               name="confirmPassword"
//               type="password"
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-lg"
//               required
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Image Upload</label>
//             <input
//               type="file"
//               onChange={(e: any) => setImage(e.target.files[0])}
//               className="w-full border px-3 py-2 rounded-lg"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Status</label>
//             <select
//               name="status"
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-lg"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>

//           <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
//             Create User
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
