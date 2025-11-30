// "use client";

// import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import axios from "axios";
// import { X, Image as ImageIcon, Edit, Trash2 } from "lucide-react";

// /* -----------------------
//    Types
//    ----------------------- */
// type PostStatus = "active" | "inactive";

// interface Post {
//   id: string;
//   title: string;
//   description: string;
//   userId: string;
//   userName?: string; // optional if API provides joined user name
//   images?: string[]; // array of image URLs
//   status: PostStatus;
//   created_at?: string;
// }

// interface User {
//   id: string;
//   firstName: string;
//   lastName?: string;
// }

// /* -----------------------
//    API endpoints - replace these with your real URLs
//    ----------------------- */
// const GET_POSTS_API = "https://your-backend.com/api/posts"; // GET (with filters)
// const CREATE_POST_API = "https://your-backend.com/api/posts/create"; // POST (multipart/form-data)
// const UPDATE_POST_API = "https://your-backend.com/api/posts/update"; // PUT /:id (multipart/form-data)
// const DELETE_POST_API = "https://your-backend.com/api/posts/delete"; // DELETE /:id
// const USERS_DROPDOWN_API = "https://your-backend.com/api/users/dropdown"; // GET active users (id, firstName,lastName)

// /* -----------------------
//    Component
//    ----------------------- */
// export default function PostsPage() {
//   // lists
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [users, setUsers] = useState<User[]>([]);

//   // filters
//   const [filters, setFilters] = useState({
//     userId: "",
//     title: "",
//     status: "",
//     from: "",
//     to: "",
//   });

//   // create form
//   const [createForm, setCreateForm] = useState({
//     title: "",
//     description: "",
//     userId: "",
//     status: "active" as PostStatus,
//   });
//   const [createImages, setCreateImages] = useState<File[]>([]);

//   // edit state
//   const [editingPost, setEditingPost] = useState<Post | null>(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     description: "",
//     userId: "",
//     status: "active" as PostStatus,
//   });
//   const [editImagesToAdd, setEditImagesToAdd] = useState<File[]>([]);
//   // (optionally you could track images to remove if backend supports)

//   // loading / UI
//   const [loading, setLoading] = useState(false);

//   /* -----------------------
//      Helpers: load users for dropdown & load posts
//      ----------------------- */
//   const loadUsers = async () => {
//     try {
//       const res = await axios.get<User[]>(USERS_DROPDOWN_API);
//       // Accept either direct array or { data: [...] }
//       setUsers(res.data.data || res.data);
//     } catch (err) {
//       console.error("Load users error", err);
//     }
//   };

//   const loadPosts = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get<Post[]>(GET_POSTS_API, { params: filters });
//       setPosts(res.data.data || res.data);
//     } catch (err) {
//       console.error("Load posts error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//     loadPosts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* -----------------------
//      Create handlers
//      ----------------------- */
//   const onCreateImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     // convert FileList to array and append
//     const arr = Array.from(files);
//     setCreateImages((prev) => [...prev, ...arr]);
//   };

//   const removeCreateImage = (index: number) => {
//     setCreateImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleCreate = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!createForm.title.trim()) {
//       alert("Title is required");
//       return;
//     }
//     if (!createForm.userId) {
//       alert("Select a user");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", createForm.title);
//     formData.append("description", createForm.description);
//     formData.append("userId", createForm.userId);
//     formData.append("status", createForm.status);

//     // append multiple images (backend should accept multiple files under same field name 'images')
//     createImages.forEach((file) => formData.append("images", file));

//     try {
//       await axios.post(CREATE_POST_API, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Post created");
//       // reset form
//       setCreateForm({
//         title: "",
//         description: "",
//         userId: "",
//         status: "active",
//       });
//       setCreateImages([]);
//       loadPosts();
//     } catch (err) {
//       console.error("Create error", err);
//       alert("Failed to create post");
//     }
//   };

//   /* -----------------------
//      Edit / Update handlers
//      ----------------------- */
//   const startEdit = (post: Post) => {
//     setEditingPost(post);
//     setEditForm({
//       title: post.title,
//       description: post.description,
//       userId: post.userId,
//       status: post.status as PostStatus,
//     });
//     setEditImagesToAdd([]);
//   };

//   const onEditImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     setEditImagesToAdd((prev) => [...prev, ...Array.from(files)]);
//   };

//   const removeEditNewImage = (index: number) => {
//     setEditImagesToAdd((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleUpdate = async () => {
//     if (!editingPost) return;

//     const formData = new FormData();
//     formData.append("title", editForm.title);
//     formData.append("description", editForm.description);
//     formData.append("userId", editForm.userId);
//     formData.append("status", editForm.status);

//     // append any new images to add
//     editImagesToAdd.forEach((f) => formData.append("images", f));

//     try {
//       await axios.put(`${UPDATE_POST_API}/${editingPost.id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Post updated");
//       setEditingPost(null);
//       loadPosts();
//     } catch (err) {
//       console.error("Update error", err);
//       alert("Failed to update post");
//     }
//   };

//   /* -----------------------
//      Delete handler
//      ----------------------- */
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await axios.delete(`${DELETE_POST_API}/${id}`);
//       alert("Post deleted");
//       loadPosts();
//     } catch (err) {
//       console.error("Delete error", err);
//       alert("Failed to delete");
//     }
//   };

//   /* -----------------------
//      UI
//      ----------------------- */
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Posts Management</h1>
//         <div>
//           <button
//             className="bg-blue-600 text-white px-3 py-2 rounded"
//             onClick={() => {
//               // scroll to create form
//               document
//                 .getElementById("create-post-form")
//                 ?.scrollIntoView({ behavior: "smooth" });
//             }}
//           >
//             + Create Post
//           </button>
//         </div>
//       </header>

//       {/* Create Form */}
//       <section
//         id="create-post-form"
//         className="bg-white p-6 rounded shadow mb-6"
//       >
//         <h2 className="text-lg font-semibold mb-3">Create Post</h2>
//         <form onSubmit={handleCreate} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               value={createForm.title}
//               onChange={(e) =>
//                 setCreateForm((s) => ({ ...s, title: e.target.value }))
//               }
//               placeholder="Title"
//               className="border p-2 rounded w-full"
//             />
//             <select
//               value={createForm.userId}
//               onChange={(e) =>
//                 setCreateForm((s) => ({ ...s, userId: e.target.value }))
//               }
//               className="border p-2 rounded"
//             >
//               <option value="">Select User</option>
//               {users.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.firstName} {u.lastName || ""}
//                 </option>
//               ))}
//             </select>
//             <textarea
//               value={createForm.description}
//               onChange={(e) =>
//                 setCreateForm((s) => ({ ...s, description: e.target.value }))
//               }
//               placeholder="Description"
//               className="border p-2 rounded md:col-span-2"
//               rows={4}
//             />
//             <select
//               value={createForm.status}
//               onChange={(e) =>
//                 setCreateForm((s) => ({
//                   ...s,
//                   status: e.target.value as PostStatus,
//                 }))
//               }
//               className="border p-2 rounded"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>

//             {/* Images input */}
//             <div className="border p-2 rounded flex flex-col gap-2">
//               <label className="flex items-center gap-2">
//                 <ImageIcon className="w-5 h-5" />
//                 <span>Images (multiple)</span>
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={onCreateImageChange}
//               />
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {createImages.map((file, idx) => (
//                   <div
//                     key={idx}
//                     className="relative border rounded overflow-hidden w-24 h-24"
//                   >
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt={file.name}
//                       className="object-cover w-full h-full"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeCreateImage(idx)}
//                       className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow"
//                     >
//                       <X className="w-4 h-4 text-red-600" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//               Create
//             </button>
//             <button
//               type="button"
//               className="bg-gray-300 px-4 py-2 rounded"
//               onClick={() => {
//                 setCreateForm({
//                   title: "",
//                   description: "",
//                   userId: "",
//                   status: "active",
//                 });
//                 setCreateImages([]);
//               }}
//             >
//               Reset
//             </button>
//           </div>
//         </form>
//       </section>

//       {/* Filters */}
//       <section className="bg-white p-4 rounded shadow mb-6">
//         <h3 className="font-medium mb-3">Filters</h3>
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
//           <select
//             value={filters.userId}
//             onChange={(e) =>
//               setFilters((s) => ({ ...s, userId: e.target.value }))
//             }
//             className="border p-2 rounded"
//           >
//             <option value="">All Users</option>
//             {users.map((u) => (
//               <option key={u.id} value={u.id}>
//                 {u.firstName} {u.lastName || ""}
//               </option>
//             ))}
//           </select>

//           <input
//             value={filters.title}
//             onChange={(e) =>
//               setFilters((s) => ({ ...s, title: e.target.value }))
//             }
//             placeholder="Title"
//             className="border p-2 rounded"
//           />

//           <select
//             value={filters.status}
//             onChange={(e) =>
//               setFilters((s) => ({ ...s, status: e.target.value }))
//             }
//             className="border p-2 rounded"
//           >
//             <option value="">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>

//           <input
//             type="date"
//             value={filters.from}
//             onChange={(e) =>
//               setFilters((s) => ({ ...s, from: e.target.value }))
//             }
//             className="border p-2 rounded"
//           />

//           <input
//             type="date"
//             value={filters.to}
//             onChange={(e) => setFilters((s) => ({ ...s, to: e.target.value }))}
//             className="border p-2 rounded"
//           />
//         </div>

//         <div className="mt-3 flex gap-2">
//           <button
//             className="bg-blue-600 text-white px-3 py-2 rounded"
//             onClick={loadPosts}
//           >
//             Apply
//           </button>
//           <button
//             className="bg-gray-300 px-3 py-2 rounded"
//             onClick={() => {
//               setFilters({
//                 userId: "",
//                 title: "",
//                 status: "",
//                 from: "",
//                 to: "",
//               });
//               loadPosts();
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </section>

//       {/* Posts table */}
//       <section className="bg-white p-4 rounded shadow mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-medium">Posts List</h3>
//           <div>{loading ? "Loading..." : `${posts.length} posts`}</div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full table-auto border-collapse">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-2 border">Images</th>
//                 <th className="p-2 border">Title</th>
//                 <th className="p-2 border">Description</th>
//                 <th className="p-2 border">Created By</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Created At</th>
//                 <th className="p-2 border">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {posts.map((p) => (
//                 <tr
//                   key={p.id}
//                   className="even:bg-white odd:bg-gray-50 align-top"
//                 >
//                   <td className="p-2 border w-28">
//                     <div className="flex gap-2">
//                       {(p.images || []).slice(0, 3).map((img, i) => (
//                         <img
//                           key={i}
//                           src={img}
//                           alt={`img-${i}`}
//                           className="w-16 h-12 object-cover rounded"
//                         />
//                       ))}
//                       {(p.images || []).length === 0 && (
//                         <div className="text-sm text-gray-400">—</div>
//                       )}
//                     </div>
//                   </td>

//                   <td className="p-2 border max-w-xs truncate">{p.title}</td>

//                   <td className="p-2 border max-w-sm truncate">
//                     {p.description}
//                   </td>

//                   <td className="p-2 border">{p.userName || p.userId}</td>

//                   <td className="p-2 border">
//                     <span
//                       className={`px-2 py-1 rounded text-white ${
//                         p.status === "active" ? "bg-green-600" : "bg-red-600"
//                       }`}
//                     >
//                       {p.status}
//                     </span>
//                   </td>

//                   <td className="p-2 border">
//                     {p.created_at
//                       ? new Date(p.created_at).toLocaleDateString()
//                       : "-"}
//                   </td>

//                   <td className="p-2 border flex gap-2">
//                     <button
//                       onClick={() => startEdit(p)}
//                       className="bg-yellow-400 px-3 py-1 rounded flex items-center gap-1"
//                     >
//                       <Edit className="w-4 h-4" /> Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(p.id)}
//                       className="bg-red-500 px-3 py-1 rounded flex items-center gap-1 text-white"
//                     >
//                       <Trash2 className="w-4 h-4" /> Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Edit Modal */}
//       {editingPost && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded p-6 w-full max-w-2xl relative">
//             <button
//               className="absolute top-3 right-3 p-1"
//               onClick={() => setEditingPost(null)}
//             >
//               <X />
//             </button>

//             <h3 className="text-lg font-semibold mb-3">Edit Post</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <input
//                 value={editForm.title}
//                 onChange={(e) =>
//                   setEditForm((s) => ({ ...s, title: e.target.value }))
//                 }
//                 className="border p-2 rounded"
//               />
//               <select
//                 value={editForm.userId}
//                 onChange={(e) =>
//                   setEditForm((s) => ({ ...s, userId: e.target.value }))
//                 }
//                 className="border p-2 rounded"
//               >
//                 <option value="">Select User</option>
//                 {users.map((u) => (
//                   <option key={u.id} value={u.id}>
//                     {u.firstName} {u.lastName || ""}
//                   </option>
//                 ))}
//               </select>
//               <textarea
//                 value={editForm.description}
//                 onChange={(e) =>
//                   setEditForm((s) => ({ ...s, description: e.target.value }))
//                 }
//                 rows={4}
//                 className="border p-2 rounded md:col-span-2"
//               />
//               <select
//                 value={editForm.status}
//                 onChange={(e) =>
//                   setEditForm((s) => ({
//                     ...s,
//                     status: e.target.value as PostStatus,
//                   }))
//                 }
//                 className="border p-2 rounded"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>

//               {/* Existing images (read-only) */}
//               <div className="md:col-span-2">
//                 <div className="mb-2 font-medium">Existing Images</div>
//                 <div className="flex gap-2 flex-wrap">
//                   {(editingPost.images || []).map((img, i) => (
//                     <img
//                       key={i}
//                       src={img}
//                       alt={`existing-${i}`}
//                       className="w-24 h-16 object-cover rounded"
//                     />
//                   ))}
//                   {(editingPost.images || []).length === 0 && (
//                     <div className="text-sm text-gray-400">No images</div>
//                   )}
//                 </div>
//               </div>

//               {/* Add new images */}
//               <div className="md:col-span-2 border p-2 rounded">
//                 <label className="flex items-center gap-2 mb-2">
//                   <ImageIcon /> Add Images
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={onEditImageChange}
//                 />
//                 <div className="flex gap-2 mt-2 flex-wrap">
//                   {editImagesToAdd.map((f, idx) => (
//                     <div key={idx} className="relative w-24 h-24">
//                       <img
//                         src={URL.createObjectURL(f)}
//                         alt={f.name}
//                         className="w-full h-full object-cover rounded"
//                       />
//                       <button
//                         onClick={() => removeEditNewImage(idx)}
//                         className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow"
//                       >
//                         <X className="w-4 h-4 text-red-600" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 mt-4 justify-end">
//               <button
//                 onClick={() => setEditingPost(null)}
//                 className="px-4 py-2 rounded bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 className="px-4 py-2 rounded bg-blue-600 text-white"
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
