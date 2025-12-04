// without  backend use local storage

"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { X, Image as ImageIcon, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { authenticatedFetch, authenticatedFormFetch } from "@/lib/utils";

const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Users for dropdowns and display
const mockUsers: User[] = [
  { id: "user1", firstName: "Alice", lastName: "Smith" },
  { id: "user2", firstName: "Bob", lastName: "Johnson" },
  { id: "user3", firstName: "Charlie", lastName: "Brown" },
];

// Initial fake posts data
const initialPosts: Post[] = [
  {
    id: generateId(),
    title: "First Post Title",
    description: "This is the description for the first post.",
    userId: "user1",
    userName: "Alice Smith",
    images: ["https://picsum.photos/id/237/200/300"],
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Second Post from Bob",
    description: "A short description for Bob's post.",
    userId: "user2",
    userName: "Bob Johnson",
    images: ["https://picsum.photos/id/238/200/300"],
    status: "inactive",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: generateId(),
    title: "Charlie's Awesome Article",
    description: "An in-depth article by Charlie.",
    userId: "user3",
    userName: "Charlie Brown",
    images: [],
    status: "active",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

/* -----------------------
   Types
   ----------------------- */
type PostStatus = "active" | "inactive";

interface Post {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName?: string; // optional if API provides joined user name
  images?: string[]; // array of image URLs
  status: PostStatus;
  created_at?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName?: string;
}

/* -----------------------
   API endpoints - Using environment variables
   ----------------------- */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const GET_POSTS_API = `${BASE_URL}${process.env.NEXT_PUBLIC_GET_POSTS_API}`;
const CREATE_POST_API = `${BASE_URL}${process.env.NEXT_PUBLIC_CREATE_POST_API}`;
const UPDATE_POST_API = `${BASE_URL}${process.env.NEXT_PUBLIC_UPDATE_POST_API}`;
const DELETE_POST_API = `${BASE_URL}${process.env.NEXT_PUBLIC_DELETE_POST_API}`;
const USERS_DROPDOWN_API = `${BASE_URL}${process.env.NEXT_PUBLIC_USERS_DROPDOWN_API}`;
const IMAGE_UPLOAD_API = `${BASE_URL}${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`;

/* -----------------------
   Component
   ----------------------- */
export default function PostsPage() {
  const { token } = useAuth();

  // lists
  const [posts, setPosts] = useState<Post[]>(initialPosts); // Initialize with mock data
  const [users, setUsers] = useState<User[]>(mockUsers); // Initialize with mock data

  // filters
  const [filters, setFilters] = useState({
    userId: "",
    title: "",
    status: "",
    from: "",
    to: "",
  });

  // create form
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    userId: "",
    status: "active" as PostStatus,
  });
  const [createImages, setCreateImages] = useState<File[]>([]);

  // edit state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    userId: "",
    status: "active" as PostStatus,
  });
  const [editImagesToAdd, setEditImagesToAdd] = useState<File[]>([]);

  // loading / UI
  const [loading, setLoading] = useState(false);

  // Removed the local authenticatedFetch and authenticatedFormFetch implementations

  /* -----------------------
     Helpers: load users for dropdown & load posts (Simulated)
     ----------------------- */
  const loadUsers = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
    setUsers(mockUsers);
  };

  const loadPosts = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    const filteredPosts = initialPosts.filter((post) => {
      const userMatch = filters.userId === "" || post.userId === filters.userId;
      const titleMatch = filters.title === "" || post.title.toLowerCase().includes(filters.title.toLowerCase());
      const statusMatch = filters.status === "" || post.status === filters.status;
      // Add date filtering if necessary

      return userMatch && titleMatch && statusMatch;
    });

    setPosts(filteredPosts);
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      loadUsers(); // Load mock users for dropdown
      loadPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filters]); // Add filters to dependency array to re-load posts when filters change

  /* -----------------------
     Create handlers (Simulated)
     ----------------------- */
  const onCreateImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files);
    setCreateImages((prev) => [...prev, ...arr]);
  };

  const removeCreateImage = (index: number) => {
    setCreateImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    if (!createForm.title.trim()) {
      alert("Title is required");
      setLoading(false);
      return;
    }
    if (!createForm.userId) {
      alert("Select a user");
      setLoading(false);
      return;
    }

    const selectedUser = users.find(u => u.id === createForm.userId);
    const newPost: Post = {
      id: generateId(),
      ...createForm,
      userName: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName || ''}`.trim() : undefined,
      images: createImages.map(file => URL.createObjectURL(file)), // Simulate image URLs
      created_at: new Date().toISOString(),
    };

    try {
      setPosts((prevPosts) => [...prevPosts, newPost]);
      alert("Post created successfully!");
      setCreateForm({
        title: "",
        description: "",
        userId: "",
        status: "active",
      });
      setCreateImages([]);
    } catch (error: any) {
      console.error("Create post error:", error);
      alert(`Failed to create post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------
     Edit / Update handlers (Simulated)
     ----------------------- */
  const startEdit = (post: Post) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      description: post.description,
      userId: post.userId,
      status: post.status as PostStatus,
    });
    setEditImagesToAdd([]);
  };

  const onEditImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setEditImagesToAdd((prev) => [...prev, ...Array.from(files)]);
  };

  const removeEditNewImage = (index: number) => {
    setEditImagesToAdd((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!editingPost) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    const selectedUser = users.find(u => u.id === editForm.userId);
    const updatedPost: Post = {
      ...editingPost,
      ...editForm,
      userName: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName || ''}`.trim() : undefined,
      // Combine existing images with newly added ones (simulated)
      images: [
        ...(editingPost.images || []),
        ...editImagesToAdd.map(file => URL.createObjectURL(file))
      ],
    };

    try {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
      alert("Post updated successfully!");
      setEditingPost(null);
      setEditImagesToAdd([]);
    } catch (error: any) {
      console.error("Update post error:", error);
      alert(`Failed to update post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------
     Delete handler (Simulated)
     ----------------------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    try {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      alert("Post deleted successfully!");
    } catch (error: any) {
      console.error("Delete post error:", error);
      alert(`Failed to delete: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------
     UI
     ----------------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts Management</h1>
        <div>
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded"
            onClick={() => {
              document
                .getElementById("create-post-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            + Create Post
          </button>
        </div>
      </header>

      {/* Create Form */}
      <section
        id="create-post-form"
        className="bg-white p-6 rounded shadow mb-6"
      >
        <h2 className="text-lg font-semibold mb-3">Create Post</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={createForm.title}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, title: e.target.value }))
              }
              placeholder="Title"
              className="border p-2 rounded w-full"
            />
            <select
              value={createForm.userId}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, userId: e.target.value }))
              }
              className="border p-2 rounded"
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName || ""}
                </option>
              ))}
            </select>
            <textarea
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, description: e.target.value }))
              }
              placeholder="Description"
              className="border p-2 rounded md:col-span-2"
              rows={4}
            />
            <select
              value={createForm.status}
              onChange={(e) =>
                setCreateForm((s) => ({
                  ...s,
                  status: e.target.value as PostStatus,
                }))
              }
              className="border p-2 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Images input */}
            <div className="border p-2 rounded flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                <span>Images (multiple)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onCreateImageChange}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {createImages.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative border rounded overflow-hidden w-24 h-24"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeCreateImage(idx)}
                      className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => {
                setCreateForm({
                  title: "",
                  description: "",
                  userId: "",
                  status: "active",
                });
                setCreateImages([]);
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* Filters */}
      <section className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-medium mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            value={filters.userId}
            onChange={(e) =>
              setFilters((s) => ({ ...s, userId: e.target.value }))
            }
            className="border p-2 rounded"
          >
            <option value="all">All Users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName || ""}
                </option>
              ))}
            </select>

            <input
              value={filters.title}
              onChange={(e) =>
                setFilters((s) => ({ ...s, title: e.target.value }))
              }
              placeholder="Title"
              className="border p-2 rounded"
            />

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((s) => ({ ...s, status: e.target.value }))
              }
              className="border p-2 rounded"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <input
              type="date"
              value={filters.from}
              onChange={(e) =>
                setFilters((s) => ({ ...s, from: e.target.value }))
              }
              className="border p-2 rounded"
            />

            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((s) => ({ ...s, to: e.target.value }))}
              className="border p-2 rounded"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded"
              onClick={loadPosts}
            >
              Apply
            </button>
            <button
              className="bg-gray-300 px-3 py-2 rounded"
              onClick={() => {
                setFilters({
                  userId: "",
                  title: "",
                  status: "",
                  from: "",
                  to: "",
                });
                loadPosts();
              }}
            >
              Reset
            </button>
          </div>
        </section>

        {/* Posts table */}
        <section className="bg-white p-4 rounded shadow mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Posts List</h3>
            <div>{loading ? "Loading..." : `${posts.length} posts`}</div>
          </div>
        </section>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Images</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Created By</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Created At</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((p) => (
                  <tr
                    key={p.id}
                    className="even:bg-white odd:bg-gray-50 align-top"
                  >
                    <td className="p-2 border w-28">
                      <div className="flex gap-2">
                        {(p.images || []).slice(0, 3).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`img-${i}`}
                            className="w-16 h-12 object-cover rounded"
                          />
                        ))}
                        {(p.images || []).length === 0 && (
                          <div className="text-sm text-gray-400">—</div>
                        )}
                      </div>
                    </td>

                    <td className="p-2 border max-w-xs truncate">{p.title}</td>

                    <td className="p-2 border max-w-sm truncate">
                      {p.description}
                    </td>

                    <td className="p-2 border">{p.userName || p.userId}</td>

                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          p.status === "active" ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="p-2 border">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="bg-yellow-400 px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-500 px-3 py-1 rounded flex items-center gap-1 text-white"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        <section/>

        {/* Edit Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            {/* Modal content continues here */}
          </div>
        )}
          <div className="bg-white rounded p-6 w-full max-w-2xl relative">
            <button
              className="absolute top-3 right-3 p-1"
              onClick={() => setEditingPost(null)}
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-3">Edit Post</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, title: e.target.value }))
                }
                className="border p-2 rounded"
              />
              <select
                value={editForm.userId}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, userId: e.target.value }))
                }
                className="border p-2 rounded"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName || ""}
                  </option>
                ))}
              </select>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, description: e.target.value }))
                }
                rows={4}
                className="border p-2 rounded md:col-span-2"
              />
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm((s) => ({
                    ...s,
                    status: e.target.value as PostStatus,
                  }))
                }
                className="border p-2 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Existing images (read-only) */}
              <div className="md:col-span-2">
                <div className="mb-2 font-medium">Existing Images</div>
                <div className="flex gap-2 flex-wrap">
                  {(editingPost?.images || []).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`existing-${i}`}
                      className="w-24 h-16 object-cover rounded"
                    />
                  ))}
                  {(!editingPost || (editingPost.images || []).length === 0) && (
                    <div className="text-sm text-gray-400">No images</div>
                  )}
                </div>
              </div>

              {/* Add new images */}
              <div className="md:col-span-2 border p-2 rounded">
                <label className="flex items-center gap-2 mb-2">
                  <ImageIcon /> Add Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onEditImageChange}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {editImagesToAdd.map((f, idx) => (
                    <div key={idx} className="relative w-24 h-24">
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        onClick={() => removeEditNewImage(idx)}
                        className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

// with back end api

// "use client";

// import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import { X, Image as ImageIcon, Edit, Trash2 } from "lucide-react";
// import { useAuth } from "@/components/AuthProvider";
// import { authenticatedFetch, authenticatedFormFetch } from "@/lib/utils";

// /* -----------------------
//    Types
//    ----------------------- */
// type PostStatus = "active" | "inactive";

// interface Post {
//   id: string;
//   title: string;
//   description: string;
//   userId: string;
//   userName?: string;
//   images?: string[];
//   status: PostStatus;
//   created_at?: string;
// }

// interface User {
//   id: string;
//   firstName: string;
//   lastName?: string;
// }

// /* -----------------------
//    API endpoints - Using environment variables
//    ----------------------- */
// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

// // If you have specific endpoints in env, use them, otherwise use these defaults
// const GET_POSTS_API = process.env.NEXT_PUBLIC_GET_POSTS_API || "/posts";
// const CREATE_POST_API = process.env.NEXT_PUBLIC_CREATE_POST_API || "/posts";
// const UPDATE_POST_API = process.env.NEXT_PUBLIC_UPDATE_POST_API || "/posts";
// const DELETE_POST_API = process.env.NEXT_PUBLIC_DELETE_POST_API || "/posts";
// const USERS_DROPDOWN_API =
//   process.env.NEXT_PUBLIC_USERS_DROPDOWN_API || "/users/dropdown";
// const IMAGE_UPLOAD_API = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || "/upload";

// /* -----------------------
//    Component
//    ----------------------- */
// export default function PostsPage() {
//   const { token } = useAuth();

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

//   // loading / UI
//   const [loading, setLoading] = useState(false);
//   const [uploadingImages, setUploadingImages] = useState(false);

//   // Debug API URLs
//   useEffect(() => {
//     console.log("=== API URL DEBUG INFO ===");
//     console.log("BASE_URL:", BASE_URL);
//     console.log("GET_POSTS_API:", `${BASE_URL}${GET_POSTS_API}`);
//     console.log("CREATE_POST_API:", `${BASE_URL}${CREATE_POST_API}`);
//     console.log("USERS_DROPDOWN_API:", `${BASE_URL}${USERS_DROPDOWN_API}`);
//     console.log("IMAGE_UPLOAD_API:", `${BASE_URL}${IMAGE_UPLOAD_API}`);
//     console.log("Token exists:", !!token);
//     console.log("==========================");
//   }, [token]);

//   /* -----------------------
//      Helper Functions for API calls
//      ----------------------- */
//   const uploadImages = async (files: File[]): Promise<string[]> => {
//     if (!files.length) return [];

//     setUploadingImages(true);
//     const uploadedUrls: string[] = [];

//     try {
//       for (const file of files) {
//         const formData = new FormData();
//         formData.append("image", file);

//         const response = await authenticatedFormFetch(
//           `${BASE_URL}${IMAGE_UPLOAD_API}`,
//           "POST",
//           formData,
//           token
//         );

//         if (response.success && response.data?.url) {
//           uploadedUrls.push(response.data.url);
//         } else {
//           console.warn("Image upload response:", response);
//         }
//       }
//     } catch (error) {
//       console.error("Image upload error:", error);
//     } finally {
//       setUploadingImages(false);
//     }

//     return uploadedUrls;
//   };

//   /* -----------------------
//      Load Users for dropdown
//      ----------------------- */
//   const loadUsers = async () => {
//     try {
//       console.log("Loading users from:", `${BASE_URL}${USERS_DROPDOWN_API}`);

//       const response = await authenticatedFetch(
//         `${BASE_URL}${USERS_DROPDOWN_API}`,
//         "GET",
//         token
//       );

//       console.log("Users response:", response);

//       if (response.success) {
//         setUsers(response.data || []);
//       } else {
//         console.error("Failed to load users:", response.message);
//         // Fallback to empty array
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error("Error loading users:", error);
//       setUsers([]);
//     }
//   };

//   /* -----------------------
//      Load Posts with filters
//      ----------------------- */
//   const loadPosts = async () => {
//     setLoading(true);
//     try {
//       // Build query params from filters
//       const queryParams = new URLSearchParams();
//       if (filters.userId) {
//         queryParams.append("userId", filters.userId);
//       }
//       if (filters.title) {
//         queryParams.append("title", filters.title);
//       }
//       if (filters.status) {
//         queryParams.append("status", filters.status);
//       }
//       if (filters.from) {
//         queryParams.append("from", filters.from);
//       }
//       if (filters.to) {
//         queryParams.append("to", filters.to);
//       }

//       const url = `${BASE_URL}${GET_POSTS_API}${
//         queryParams.toString() ? `?${queryParams.toString()}` : ""
//       }`;

//       console.log("Loading posts from:", url);

//       const response = await authenticatedFetch(url, "GET", token);

//       console.log("Posts response:", response);

//       if (response.success) {
//         setPosts(response.data || []);
//       } else {
//         console.error("Failed to load posts:", response.message);
//         // Fallback to empty array for testing
//         setPosts([]);
//       }
//     } catch (error) {
//       console.error("Error loading posts:", error);
//       // Fallback to empty array
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       loadUsers();
//       loadPosts();
//     }
//   }, [token]);

//   /* -----------------------
//      Create Post Handler
//      ----------------------- */
//   const onCreateImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
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

//     setLoading(true);

//     try {
//       // First upload images if any
//       let uploadedImageUrls: string[] = [];
//       if (createImages.length > 0) {
//         console.log("Uploading images...");
//         uploadedImageUrls = await uploadImages(createImages);
//         console.log("Uploaded image URLs:", uploadedImageUrls);
//       }

//       // Prepare post data
//       const postData = {
//         title: createForm.title,
//         description: createForm.description,
//         userId: createForm.userId,
//         status: createForm.status,
//         images: uploadedImageUrls,
//       };

//       console.log("Creating post with data:", postData);
//       console.log("API URL:", `${BASE_URL}${CREATE_POST_API}`);

//       // Create post
//       const response = await authenticatedFetch(
//         `${BASE_URL}${CREATE_POST_API}`,
//         "POST",
//         token,
//         postData
//       );

//       console.log("Create post response:", response);

//       if (response.success) {
//         alert("Post created successfully!");
//         setCreateForm({
//           title: "",
//           description: "",
//           userId: "",
//           status: "active",
//         });
//         setCreateImages([]);
//         loadPosts(); // Refresh the list
//       } else {
//         alert(`Failed to create post: ${response.message}`);
//       }
//     } catch (error: any) {
//       console.error("Create post error:", error);
//       alert(`Failed to create post: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -----------------------
//      Edit / Update Handlers
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

//     if (!editForm.title.trim()) {
//       alert("Title is required");
//       return;
//     }
//     if (!editForm.userId) {
//       alert("Select a user");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Upload new images if any
//       let newImageUrls: string[] = [];
//       if (editImagesToAdd.length > 0) {
//         console.log("Uploading new images for edit...");
//         newImageUrls = await uploadImages(editImagesToAdd);
//         console.log("New image URLs:", newImageUrls);
//       }

//       // Prepare update data
//       const updateData = {
//         title: editForm.title,
//         description: editForm.description,
//         userId: editForm.userId,
//         status: editForm.status,
//         images: [...(editingPost.images || []), ...newImageUrls],
//       };

//       console.log("Updating post with data:", updateData);
//       console.log(
//         "API URL:",
//         `${BASE_URL}${UPDATE_POST_API}/${editingPost.id}`
//       );

//       // Update post
//       const response = await authenticatedFetch(
//         `${BASE_URL}${UPDATE_POST_API}/${editingPost.id}`,
//         "PUT",
//         token,
//         updateData
//       );

//       console.log("Update post response:", response);

//       if (response.success) {
//         alert("Post updated successfully!");
//         setEditingPost(null);
//         setEditImagesToAdd([]);
//         loadPosts(); // Refresh the list
//       } else {
//         alert(`Failed to update post: ${response.message}`);
//       }
//     } catch (error: any) {
//       console.error("Update post error:", error);
//       alert(`Failed to update post: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -----------------------
//      Delete Handler
//      ----------------------- */
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this post?")) return;

//     setLoading(true);

//     try {
//       console.log("Deleting post ID:", id);
//       console.log("API URL:", `${BASE_URL}${DELETE_POST_API}/${id}`);

//       const response = await authenticatedFetch(
//         `${BASE_URL}${DELETE_POST_API}/${id}`,
//         "DELETE",
//         token
//       );

//       console.log("Delete response:", response);

//       if (response.success) {
//         alert("Post deleted successfully!");
//         loadPosts(); // Refresh the list
//       } else {
//         alert(`Failed to delete: ${response.message}`);
//       }
//     } catch (error: any) {
//       console.error("Delete post error:", error);
//       alert(`Failed to delete: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -----------------------
//      Test API Connection Function
//      ----------------------- */
//   const testAPIConnection = async () => {
//     console.log("=== TESTING API CONNECTION ===");

//     try {
//       // Test 1: Test GET posts without auth first
//       const testUrl = `${BASE_URL}${GET_POSTS_API}`;
//       console.log("Testing URL:", testUrl);

//       const response = await fetch(testUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Response status:", response.status);
//       console.log("Response status text:", response.statusText);
//       console.log("Response headers:", response.headers);

//       if (response.ok) {
//         try {
//           const data = await response.json();
//           console.log("API response data:", data);
//           alert(
//             `✅ API connection successful!\nStatus: ${
//               response.status
//             }\nData type: ${Array.isArray(data) ? "Array" : "Object"}`
//           );
//         } catch (jsonError) {
//           console.log("Response text:", await response.text());
//           alert(
//             `⚠️ API connected but response is not JSON.\nStatus: ${response.status}`
//           );
//         }
//       } else {
//         console.error("API error status:", response.status);
//         const errorText = await response.text();
//         console.error("API error response:", errorText);
//         alert(
//           `❌ API error: ${response.status} ${
//             response.statusText
//           }\n\n${errorText.substring(0, 200)}...`
//         );
//       }
//     } catch (error: any) {
//       console.error("API connection failed:", error);
//       alert(
//         `API connection failed!\n\nError: ${
//           error.message || "Unknown error"
//         }\n\nMake sure:\n1. Backend server is running\n2. CORS is enabled\n3. URL is correct: ${BASE_URL}`
//       );
//     }
//   };

//   /* -----------------------
//      UI
//      ----------------------- */
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Posts Management</h1>
//         <div className="flex gap-2">
//           <button
//             onClick={testAPIConnection}
//             className="bg-purple-600 text-white px-3 py-2 rounded"
//           >
//             Test API
//           </button>
//           <button
//             className="bg-blue-600 text-white px-3 py-2 rounded"
//             onClick={() => {
//               document
//                 .getElementById("create-post-form")
//                 ?.scrollIntoView({ behavior: "smooth" });
//             }}
//           >
//             + Create Post
//           </button>
//         </div>
//       </header>

//       {/* Debug Info Panel */}
//       <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
//         <h3 className="font-semibold text-yellow-800">API Debug Info:</h3>
//         <p className="text-sm text-yellow-700">
//           Base URL:{" "}
//           <code className="bg-yellow-100 px-1 rounded">{BASE_URL}</code>
//         </p>
//         <p className="text-sm text-yellow-700">
//           Posts Endpoint:{" "}
//           <code className="bg-yellow-100 px-1 rounded">{GET_POSTS_API}</code>
//         </p>
//         <p className="text-sm text-yellow-700">
//           Full URL:{" "}
//           <code className="bg-yellow-100 px-1 rounded">{`${BASE_URL}${GET_POSTS_API}`}</code>
//         </p>
//       </div>

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
//               required
//             />
//             <select
//               value={createForm.userId}
//               onChange={(e) =>
//                 setCreateForm((s) => ({ ...s, userId: e.target.value }))
//               }
//               className="border p-2 rounded"
//               required
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
//               required
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
//               {uploadingImages && (
//                 <div className="text-sm text-blue-600">Uploading images...</div>
//               )}
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
//               className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
//               disabled={loading || uploadingImages}
//             >
//               {loading ? "Creating..." : "Create"}
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
//             className="bg-blue-600 text-white px-3 py-2 rounded disabled:bg-gray-400"
//             onClick={loadPosts}
//             disabled={loading}
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
//           <div className="flex items-center gap-4">
//             <div>{loading ? "Loading..." : `${posts.length} posts`}</div>
//             <button
//               onClick={loadPosts}
//               className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
//             >
//               Refresh
//             </button>
//           </div>
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
//               {posts.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="p-8 text-center">
//                     {loading ? (
//                       <div className="flex flex-col items-center gap-2">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                         <span>Loading posts...</span>
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center gap-2">
//                         <p className="text-gray-500">No posts found</p>
//                         <p className="text-sm text-gray-400">
//                           {users.length === 0
//                             ? "Users not loaded yet"
//                             : "Try creating a new post or check API connection"}
//                         </p>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ) : (
//                 posts.map((p) => (
//                   <tr
//                     key={p.id}
//                     className="even:bg-white odd:bg-gray-50 align-top"
//                   >
//                     <td className="p-2 border w-28">
//                       <div className="flex gap-2">
//                         {(p.images || []).slice(0, 3).map((img, i) => (
//                           <img
//                             key={i}
//                             src={img}
//                             alt={`img-${i}`}
//                             className="w-16 h-12 object-cover rounded"
//                           />
//                         ))}
//                         {(p.images || []).length === 0 && (
//                           <div className="text-sm text-gray-400">—</div>
//                         )}
//                       </div>
//                     </td>

//                     <td className="p-2 border max-w-xs truncate">{p.title}</td>

//                     <td className="p-2 border max-w-sm truncate">
//                       {p.description}
//                     </td>

//                     <td className="p-2 border">
//                       {p.userName ||
//                         users.find((u) => u.id === p.userId)?.firstName ||
//                         p.userId}
//                     </td>

//                     <td className="p-2 border">
//                       <span
//                         className={`px-2 py-1 rounded text-white ${
//                           p.status === "active" ? "bg-green-600" : "bg-red-600"
//                         }`}
//                       >
//                         {p.status}
//                       </span>
//                     </td>

//                     <td className="p-2 border">
//                       {p.created_at
//                         ? new Date(p.created_at).toLocaleDateString()
//                         : "-"}
//                     </td>

//                     <td className="p-2 border flex gap-2">
//                       <button
//                         onClick={() => startEdit(p)}
//                         className="bg-yellow-400 px-3 py-1 rounded flex items-center gap-1 disabled:bg-gray-300"
//                         disabled={loading}
//                       >
//                         <Edit className="w-4 h-4" /> Edit
//                       </button>

//                       <button
//                         onClick={() => handleDelete(p.id)}
//                         className="bg-red-500 px-3 py-1 rounded flex items-center gap-1 text-white disabled:bg-gray-300"
//                         disabled={loading}
//                       >
//                         <Trash2 className="w-4 h-4" /> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
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
//                 required
//               />
//               <select
//                 value={editForm.userId}
//                 onChange={(e) =>
//                   setEditForm((s) => ({ ...s, userId: e.target.value }))
//                 }
//                 className="border p-2 rounded"
//                 required
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
//                 required
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
//                   {(editingPost?.images || []).map((img, i) => (
//                     <img
//                       key={i}
//                       src={img}
//                       alt={`existing-${i}`}
//                       className="w-24 h-16 object-cover rounded"
//                     />
//                   ))}
//                   {(!editingPost ||
//                     (editingPost.images || []).length === 0) && (
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
//                 {uploadingImages && (
//                   <div className="text-sm text-blue-600 mt-2">
//                     Uploading images...
//                   </div>
//                 )}
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
//                 className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
//                 disabled={loading || uploadingImages}
//               >
//                 {loading ? "Updating..." : "Update"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import { X, Image as ImageIcon, Edit, Trash2 } from "lucide-react";
// import { useAuth } from "@/components/AuthProvider";
// import { authenticatedFetch, authenticatedFormFetch } from "@/lib/utils";

// /* -----------------------
//    Types
//    ----------------------- */
// type PostStatus = "active" | "inactive";

// interface Post {
//   id: string;
//   title: string;
//   description: string;
//   userId: string;
//   userName?: string;
//   images?: string[];
//   status: PostStatus;
//   created_at?: string;
// }

// interface User {
//   id: string;
//   firstName: string;
//   lastName?: string;
// }

// /* -----------------------
//    API endpoints - Using environment variables
//    ----------------------- */
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

// const GET_POSTS_API = process.env.NEXT_PUBLIC_GET_POSTS_API || "/posts";
// const CREATE_POST_API = process.env.NEXT_PUBLIC_CREATE_POST_API || "/posts";
// const UPDATE_POST_API = process.env.NEXT_PUBLIC_UPDATE_POST_API || "/posts";
// const DELETE_POST_API = process.env.NEXT_PUBLIC_DELETE_POST_API || "/posts";
// const USERS_DROPDOWN_API = process.env.NEXT_PUBLIC_USERS_DROPDOWN_API || "/users/dropdown";
// const IMAGE_UPLOAD_API = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || "/upload";

// /* -----------------------
//    Component
//    ----------------------- */
// export default function PostsPage(): JSX.Element {
//   const { token } = useAuth();

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

//   // loading / UI
//   const [loading, setLoading] = useState(false);
//   const [uploadingImages, setUploadingImages] = useState(false);

//   // Debug API URLs
//   useEffect(() => {
//     console.log("=== API URL DEBUG INFO ===");
//     console.log("BASE_URL:", BASE_URL);
//     console.log("GET_POSTS_API:", `${BASE_URL}${GET_POSTS_API}`);
//     console.log("CREATE_POST_API:", `${BASE_URL}${CREATE_POST_API}`);
//     console.log("USERS_DROPDOWN_API:", `${BASE_URL}${USERS_DROPDOWN_API}`);
//     console.log("IMAGE_UPLOAD_API:", `${BASE_URL}${IMAGE_UPLOAD_API}`);
//     console.log("Token exists:", !!token);
//     console.log("==========================");
//   }, [token]);

//   /* -----------------------
//      Helper Functions for API calls
//      ----------------------- */
//   const uploadImages = async (files: File[]): Promise<string[]> => {
//     if (!files.length) return [];

//     setUploadingImages(true);
//     const uploadedUrls: string[] = [];

//     try {
//       for (const file of files) {
//         const formData = new FormData();
//         formData.append("image", file);

//         // authenticatedFormFetch should handle token and return { success, data, message } shape
//         const response = await authenticatedFormFetch(
//           `${BASE_URL}${IMAGE_UPLOAD_API}`,
//           "POST",
//           formData,
//           token
//         );

//         if (response?.success && response.data?.url) {
//           uploadedUrls.push(response.data.url);
//         } else {
//           console.warn("Image upload response:", response);
//         }
//       }
//     } catch (error) {
//       console.error("Image upload error:", error);
//     } finally {
//       setUploadingImages(false);
//     }

//     return uploadedUrls;
//   };

//   /* -----------------------
//      Load Users for dropdown
//      ----------------------- */
//   const loadUsers = async () => {
//     try {
//       console.log("Loading users from:", `${BASE_URL}${USERS_DROPDOWN_API}`);

//       const response = await authenticatedFetch(`${BASE_URL}${USERS_DROPDOWN_API}`, "GET", token);

//       console.log("Users response:", response);

//       if (response?.success) {
//         setUsers(response.data || []);
//       } else {
//         console.error("Failed to load users:", response?.message);
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error("Error loading users:", error);
//       setUsers([]);
//     }
//   };

//   /* -----------------------
//      Load Posts with filters
//      ----------------------- */
//   const loadPosts = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams();
//       if (filters.userId) queryParams.append("userId", filters.userId);
//       if (filters.title) queryParams.append("title", filters.title);
//       if (filters.status) queryParams.append("status", filters.status);
//       if (filters.from) queryParams.append("from", filters.from);
//       if (filters.to) queryParams.append("to", filters.to);

//       const url = `${BASE_URL}${GET_POSTS_API}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

//       console.log("Loading posts from:", url);

//       const response = await authenticatedFetch(url, "GET", token);

//       console.log("Posts response:", response);

//       if (response?.success) {
//         setPosts(response.data || []);
//       } else {
//         console.error("Failed to load posts:", response?.message);
//         setPosts([]);
//       }
//     } catch (error) {
//       console.error("Error loading posts:", error);
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       loadUsers();
//       loadPosts();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   /* -----------------------
//      Create Post Handler
//      ----------------------- */
//   const onCreateImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
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

//     setLoading(true);

//     try {
//       let uploadedImageUrls: string[] = [];
//       if (createImages.length > 0) {
//         console.log("Uploading images...");
//         uploadedImageUrls = await uploadImages(createImages);
//         console.log("Uploaded image URLs:", uploadedImageUrls);
//       }

//       const postData = {
//         title: createForm.title,
//         description: createForm.description,
//         userId: createForm.userId,
//         status: createForm.status,
//         images: uploadedImageUrls,
//       };

//       console.log("Creating post with data:", postData);
//       console.log("API URL:", `${BASE_URL}${CREATE_POST_API}`);

//       const response = await authenticatedFetch(`${BASE_URL}${CREATE_POST_API}`, "POST", token, postData);

//       console.log("Create post response:", response);

//       if (response?.success) {
//         alert("Post created successfully!");
//         setCreateForm({
//           title: "",
//           description: "",
//           userId: "",
//           status: "active",
//         });
//         setCreateImages([]);
//         loadPosts();
//       } else {
//         alert(`Failed to create post: ${response?.message || "Unknown error"}`);
//       }
//     } catch (error: any) {
//       console.error("Create post error:", error);
//       alert(`Failed to create post: ${error?.message || "Unknown error"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -----------------------
//      Edit / Update Handlers
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

//     if (!editForm.title.trim()) {
//       alert("Title is required");
//       return;
//     }
//     if (!editForm.userId) {
//       alert("Select a user");
//       return;
//     }

//     setLoading(true);

//     try {
//       let newImageUrls: string[] = [];
//       if (editImagesToAdd.length > 0) {
//         console.log("Uploading new images for edit...");
//         newImageUrls = await uploadImages(editImagesToAdd);
//         console.log("New image URLs:", newImageUrls);
//       }

//       const updateData = {
//         title: editForm.title,
//         description: editForm.description,
//         userId: editForm.userId,
//         status: editForm.status,
//         images: [...(editingPost.images || []), ...newImageUrls],
//       };

//       console.log("Updating post with data:", updateData);
//       console.log("API URL:", `${BASE_URL}${UPDATE_POST_API}/${editingPost.id}`);

//       const response = await authenticatedFetch(`${BASE_URL}${UPDATE_POST_API}/${editingPost.id}`, "PUT", token, updateData);

//       console.log("Update post response:", response);

//       if (response?.success) {
//         alert("Post updated successfully!");
//         setEditingPost(null);
//         setEditImagesToAdd([]);
//         loadPosts();
//       } else {
//         alert(`Failed to update post: ${response?.message || "Unknown error"}`);
//       }
//     } catch (error: any) {
//       console.error("Update post error:", error);
//       alert(`Failed to update post: ${error?.message || "Unknown error"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -----------------------
//      Delete Handler
//      ----------------------- */
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this post?")) return;

//     setLoading(true);

//     try {
//       console.log("Deleting post ID:", id);
//       console.log("API URL:", `${BASE_URL}${DELETE_POST_API}/${id}`);

//       const response = await authenticatedFetch(`${BASE_URL}${DELETE_POST_API}/${id}`, "DELETE", token);

//       console.log("Delete response:", response);

//       if (response?.success) {
//         alert("Post deleted successfully!");
//         loadPosts();
//       } else {
//         alert(`Failed to delete: ${response?.message || "Unknown error"}`);
//       }
//     } catch (error: any) {
//       console.error("Delete post error:", error);
//       alert(`Failed to delete: ${error?.message || "Unknown error"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -----------------------
//      Test API Connection Function
//      ----------------------- */
//   const testAPIConnection = async () => {
//     console.log("=== TESTING API CONNECTION ===");

//     try {
//       const testUrl = `${BASE_URL}${GET_POSTS_API}`;
//       console.log("Testing URL:", testUrl);

//       const response = await fetch(testUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       console.log("Response status:", response.status);
//       console.log("Response status text:", response.statusText);
//       console.log("Response headers:", response.headers);

//       if (response.ok) {
//         try {
//           const data = await response.json();
//           console.log("API response data:", data);
//           alert(`✅ API connection successful!\nStatus: ${response.status}\nData type: ${Array.isArray(data) ? "Array" : "Object"}`);
//         } catch (jsonError) {
//           console.log("Response text:", await response.text());
//           alert(`⚠️ API connected but response is not JSON.\nStatus: ${response.status}`);
//         }
//       } else {
//         console.error("API error status:", response.status);
//         const errorText = await response.text();
//         console.error("API error response:", errorText);
//         alert(`❌ API error: ${response.status} ${response.statusText}\n\n${errorText.substring(0, 200)}...`);
//       }
//     } catch (error: any) {
//       console.error("API connection failed:", error);
//       alert(`API connection failed!\n\nError: ${error?.message || "Unknown error"}\n\nMake sure:\n1. Backend server is running\n2. CORS is enabled\n3. URL is correct: ${BASE_URL}`);
//     }
//   };

//   /* -----------------------
//      UI
//      ----------------------- */
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Posts Management</h1>
//         <div className="flex gap-2">
//           <button onClick={testAPIConnection} className="bg-purple-600 text-white px-3 py-2 rounded">
//             Test API
//           </button>
//           <button
//             className="bg-blue-600 text-white px-3 py-2 rounded"
//             onClick={() => {
//               document.getElementById("create-post-form")?.scrollIntoView({ behavior: "smooth" });
//             }}
//           >
//             + Create Post
//           </button>
//         </div>
//       </header>

//       {/* Debug Info Panel */}
//       <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
//         <h3 className="font-semibold text-yellow-800">API Debug Info:</h3>
//         <p className="text-sm text-yellow-700">
//           Base URL: <code className="bg-yellow-100 px-1 rounded">{BASE_URL}</code>
//         </p>
//         <p className="text-sm text-yellow-700">
//           Posts Endpoint: <code className="bg-yellow-100 px-1 rounded">{GET_POSTS_API}</code>
//         </p>
//         <p className="text-sm text-yellow-700">
//           Full URL: <code className="bg-yellow-100 px-1 rounded">{`${BASE_URL}${GET_POSTS_API}`}</code>
//         </p>
//       </div>

//       {/* Create Form */}
//       <section id="create-post-form" className="bg-white p-6 rounded shadow mb-6">
//         <h2 className="text-lg font-semibold mb-3">Create Post</h2>
//         <form onSubmit={handleCreate} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               value={createForm.title}
//               onChange={(e) => setCreateForm((s) => ({ ...s, title: e.target.value }))}
//               placeholder="Title"
//               className="border p-2 rounded w-full"
//               required
//             />
//             <select
//               value={createForm.userId}
//               onChange={(e) => setCreateForm((s) => ({ ...s, userId: e.target.value }))}
//               className="border p-2 rounded"
//               required
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
//               onChange={(e) => setCreateForm((s) => ({ ...s, description: e.target.value }))}
//               placeholder="Description"
//               className="border p-2 rounded md:col-span-2"
//               rows={4}
//               required
//             />
//             <select
//               value={createForm.status}
//               onChange={(e) => setCreateForm((s) => ({ ...s, status: e.target.value as PostStatus }))}
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
//               <input type="file" accept="image/*" multiple onChange={onCreateImageChange} />
//               {uploadingImages && <div className="text-sm text-blue-600">Uploading images...</div>}
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {createImages.map((file, idx) => (
//                   <div key={idx} className="relative border rounded overflow-hidden w-24 h-24">
//                     <img src={URL.createObjectURL(file)} alt={file.name} className="object-cover w-full h-full" />
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
//             <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400" disabled={loading || uploadingImages}>
//               {loading ? "Creating..." : "Create"}
//             </button>
//             <button
//               type="button"
//               className="bg-gray-300 px-4 py-2 rounded"
//               onClick={() => {
//                 setCreateForm({ title: "", description: "", userId: "", status: "active" });
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
//           <select value={filters.userId} onChange={(e) => setFilters((s) => ({ ...s, userId: e.target.value }))} className="border p-2 rounded">
//             <option value="">All Users</option>
//             {users.map((u) => (
//               <option key={u.id} value={u.id}>
//                 {u.firstName} {u.lastName || ""}
//               </option>
//             ))}
//           </select>

//           <input value={filters.title} onChange={(e) => setFilters((s) => ({ ...s, title: e.target.value }))} placeholder="Title" className="border p-2 rounded" />

//           <select value={filters.status} onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))} className="border p-2 rounded">
//             <option value="">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>

//           <input type="date" value={filters.from} onChange={(e) => setFilters((s) => ({ ...s, from: e.target.value }))} className="border p-2 rounded" />

//           <input type="date" value={filters.to} onChange={(e) => setFilters((s) => ({ ...s, to: e.target.value }))} className="border p-2 rounded" />
//         </div>

//         <div className="mt-3 flex gap-2">
//           <button className="bg-blue-600 text-white px-3 py-2 rounded disabled:bg-gray-400" onClick={loadPosts} disabled={loading}>
//             Apply
//           </button>
//           <button
//             className="bg-gray-300 px-3 py-2 rounded"
//             onClick={() => {
//               setFilters({ userId: "", title: "", status: "", from: "", to: "" });
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
//           <div className="flex items-center gap-4">
//             <div>{loading ? "Loading..." : `${posts.length} posts`}</div>
//             <button onClick={loadPosts} className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
//               Refresh
//             </button>
//           </div>
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
//               {posts.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="p-8 text-center">
//                     {loading ? (
//                       <div className="flex flex-col items-center gap-2">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                         <span>Loading posts...</span>
//                       </div>
//                     ) : (
//                       <div className="flex flex-col items-center gap-2">
//                         <p className="text-gray-500">No posts found</p>
//                         <p className="text-sm text-gray-400">{users.length === 0 ? "Users not loaded yet" : "Try creating a new post or check API connection"}</p>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ) : (
//                 posts.map((p) => (
//                   <tr key={p.id} className="even:bg-white odd:bg-gray-50 align-top">
//                     <td className="p-2 border w-28">
//                       <div className="flex gap-2">
//                         {(p.images || []).slice(0, 3).map((img, i) => (
//                           <img key={i} src={img} alt={`img-${i}`} className="w-16 h-12 object-cover rounded" />
//                         ))}
//                         {(p.images || []).length === 0 && <div className="text-sm text-gray-400">—</div>}
//                       </div>
//                     </td>

//                     <td className="p-2 border max-w-xs truncate">{p.title}</td>

//                     <td className="p-2 border max-w-sm truncate">{p.description}</td>

//                     <td className="p-2 border">{p.userName || users.find((u) => u.id === p.userId)?.firstName || p.userId}</td>

//                     <td className="p-2 border">
//                       <span className={`px-2 py-1 rounded text-white ${p.status === "active" ? "bg-green-600" : "bg-red-600"}`}>{p.status}</span>
//                     </td>

//                     <td className="p-2 border">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}</td>

//                     <td className="p-2 border flex gap-2">
//                       <button onClick={() => startEdit(p)} className="bg-yellow-400 px-3 py-1 rounded flex items-center gap-1 disabled:bg-gray-300" disabled={loading}>
//                         <Edit className="w-4 h-4" /> Edit
//                       </button>

//                       <button onClick={() => handleDelete(p.id)} className="bg-red-500 px-3 py-1 rounded flex items-center gap-1 text-white disabled:bg-gray-300" disabled={loading}>
//                         <Trash2 className="w-4 h-4" /> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Edit Modal */}
//       {editingPost && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded p-6 w-full max-w-2xl relative">
//             <button className="absolute top-3 right-3 p-1" onClick={() => setEditingPost(null)}>
//               <X />
//             </button>

//             <h3 className="text-lg font-semibold mb-3">Edit Post</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <input value={editForm.title} onChange={(e) => setEditForm((s) => ({ ...s, title: e.target.value }))} className="border p-2 rounded" required />

//               <select value={editForm.userId} onChange={(e) => setEditForm((s) => ({ ...s, userId: e.target.value }))} className="border p-2 rounded" required>
//                 <option value="">Select User</option>
//                 {users.map((u) => (
//                   <option key={u.id} value={u.id}>
//                     {u.firstName} {u.lastName || ""}
//                   </option>
//                 ))}
//               </select>

//               <textarea value={editForm.description} onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))} rows={4} className="border p-2 rounded md:col-span-2" required />

//               <select value={editForm.status} onChange={(e) => setEditForm((s) => ({ ...s, status: e.target.value as PostStatus }))} className="border p-2 rounded">
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>

//               {/* Existing images (read-only) */}
//               <div className="md:col-span-2">
//                 <div className="mb-2 font-medium">Existing Images</div>
//                 <div className="flex gap-2 flex-wrap">
//                   {(editingPost?.images || []).map((img, i) => (
//                     <img key={i} src={img} alt={`existing-${i}`} className="w-24 h-16 object-cover rounded" />
//                   ))}
//                   {(!editingPost || (editingPost.images || []).length === 0) && <div className="text-sm text-gray-400">No images</div>}
//                 </div>
//               </div>

//               {/* Add new images */}
//               <div className="md:col-span-2 border p-2 rounded">
//                 <label className="flex items-center gap-2 mb-2">
//                   <ImageIcon /> Add Images
//                 </label>
//                 <input type="file" accept="image/*" multiple onChange={onEditImageChange} />
//                 {uploadingImages && <div className="text-sm text-blue-600 mt-2">Uploading images...</div>}
//                 <div className="flex gap-2 mt-2 flex-wrap">
//                   {editImagesToAdd.map((f, idx) => (
//                     <div key={idx} className="relative w-24 h-24">
//                       <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover rounded" />
//                       <button onClick={() => removeEditNewImage(idx)} className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow">
//                         <X className="w-4 h-4 text-red-600" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 mt-4 justify-end">
//               <button onClick={() => setEditingPost(null)} className="px-4 py-2 rounded bg-gray-300">
//                 Cancel
//               </button>
//               <button onClick={handleUpdate} className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400" disabled={loading || uploadingImages}>
//                 {loading ? "Updating..." : "Update"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
