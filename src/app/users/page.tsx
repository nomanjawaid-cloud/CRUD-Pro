// my-app/src/app/users/page.tsx
"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";


// Shadcn UI components
import {
  Table,
  TableHeader,
  TableBody,

  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import { Edit, Trash2, UserPlus, X, Image as ImageIcon } from "lucide-react";

// Helper to generate unique IDs for simulated data
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial fake users data
const initialUsers: User[] = [
  {
    id: generateId(),
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",

   
    status: "active",
    role: "user",
    profilePicture: "https://avatar.iran.liara.run/public/boy?username=john",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
  
    status: "inactive",
    role: "admin",
    profilePicture: "https://avatar.iran.liara.run/public/girl?username=jane",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: generateId(),
    firstName: "Peter",
    lastName: "Jones",
    email: "peter.jones@example.com",
    

    status: "active",
    role: "user",
    profilePicture: "https://avatar.iran.liara.run/public/boy?username=peter",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
];

/* -----------------------
   Types
   ----------------------- */
type UserStatus = "active" | "inactive";
type UserRole = "admin" | "user";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  status: UserStatus;
  role?: UserRole;
  profilePicture?: string;
  created_at?: string;
}

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  status: UserStatus;
  role?: UserRole;
}

/* -----------------------
   API endpoints - Using environment variables
   ----------------------- */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const GET_USERS_API = `${BASE_URL}${process.env.NEXT_PUBLIC_GET_USERS_API}`;
const CREATE_USER_API = `${BASE_URL}${process.env.NEXT_PUBLIC_CREATE_USER_API}`;
const UPDATE_USER_API = `${BASE_URL}${process.env.NEXT_PUBLIC_UPDATE_USER_API}`;
const DELETE_USER_API = `${BASE_URL}${process.env.NEXT_PUBLIC_DELETE_USER_API}`;
const IMAGE_UPLOAD_API = `${BASE_URL}${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`;

/* -----------------------
   Component
   ----------------------- */
export default function UsersPage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>(initialUsers); // Initialize with mock data
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    status: "",
    role: "",
    from: "",
    to: "",
  });

  // Create User states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<UserForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: "active",
    
  });
  const [createProfilePicture, setCreateProfilePicture] = useState<File | null>(
    null,
  );

  // Edit User states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UserForm>({
    firstName: "",
    lastName: "",
    email: "",


    status: "active",
  
  });
  const [editProfilePicture, setEditProfilePicture] = useState<File | null>(
    null,
  );

  // Authentication check
  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/auth/login");
    }
  }, [token, authLoading, router]);

  /* -----------------------\
     Load Users Function (Simulated)
     ----------------------- */
  const loadUsers = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    const filteredUsers = initialUsers.filter((user) => {
      const nameMatch =
        filters.name === "" ||
        user.firstName.toLowerCase().includes(filters.name.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filters.name.toLowerCase());
      const emailMatch = filters.email === "" || user.email.toLowerCase().includes(filters.email.toLowerCase());
      const statusMatch = filters.status === "" || user.status === filters.status;
      
      // Implement date filtering if needed

      return nameMatch && emailMatch && statusMatch;
    });

    setUsers(filteredUsers); // Update with filtered mock data
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && token) {
      loadUsers();
    }
  }, [token, authLoading, filters]);

  /* -----------------------\
     Create User Functions (Simulated)
     ----------------------- */
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    let profilePictureUrl: string | undefined = createProfilePicture ? URL.createObjectURL(createProfilePicture) : undefined;

    try {
      const newUser: User = {
        id: generateId(),
        ...createForm,
        profilePicture: profilePictureUrl || "https://avatar.iran.liara.run/public/boy", // Default if no picture
        created_at: new Date().toISOString(),
      };

      setUsers((prevUsers) => [...prevUsers, newUser]);
      alert("User created successfully!");
      setIsCreateDialogOpen(false);
      setCreateForm({
        firstName: "", lastName: "", email: "", 
        status: "active",
            });
      setCreateProfilePicture(null);
    } catch (error: any) {
      console.error("Create user error:", error);
      alert(`Failed to create user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCreateProfilePicture(e.target.files[0]);
    }
  };

  /* -----------------------\
     Edit User Functions (Simulated)
     ----------------------- */
  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      confirmPassword: "",
      status: user.status,
    
    });
    setEditProfilePicture(null); // Clear previous edit picture
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    let profilePictureUrl: string | undefined = editingUser.profilePicture;
    if (editProfilePicture) {
      profilePictureUrl = URL.createObjectURL(editProfilePicture);
    }

    try {
      const updatedUser: User = {
        ...editingUser,
        ...editForm,
        profilePicture: profilePictureUrl,
      };

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      alert("User updated successfully!");
      setIsEditDialogOpen(false);
      setEditingUser(null);
      setEditProfilePicture(null);
    } catch (error: any) {
      console.error("Update user error:", error);
      alert(`Failed to update user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onEditProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditProfilePicture(e.target.files[0]);
    }
  };

  /* -----------------------\
     Delete User Function (Simulated)
     ----------------------- */
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    try {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert("User deleted successfully!");
    } catch (error: any) {
      console.error("Delete user error:", error);
      alert(`Failed to delete user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading authentication...
      </div>
    );
  }

  /* -----------------------\
     UI
     ----------------------- */
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="grid gap-4 py-4">
              <Input
                placeholder="First Name"
                value={createForm.firstName}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
              />
              <Input
                placeholder="Last Name"
                value={createForm.lastName}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={createForm.confirmPassword}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                required
              />
              <Select
                value={createForm.status}
                onValueChange={(value: UserStatus) =>
                  setCreateForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={createForm.role}
                onValueChange={(value: UserRole) =>
                  setCreateForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                  Profile Picture
                </label>
                <Input type="file" onChange={onProfilePictureChange} />
                {createProfilePicture && (
                  <div className="mt-2 relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(createProfilePicture)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => setCreateProfilePicture(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Name"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            type="email"
            placeholder="Email"
            value={filters.email}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.role ?? ""}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={filters.from}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, from: e.target.value }))
            }
          />
          <Input
            type="date"
            value={filters.to}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, to: e.target.value }))
            }
          />
        </div>
        <div className="flex space-x-2 mt-4">
          <Button onClick={loadUsers} disabled={loading}>
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                name: "", email: "", status: "", role: "", from: "", to: ""
              });
            }}
            disabled={loading}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Users List</h2>
          {loading && <p>Loading users...</p>}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.profilePicture || "/placeholder-avatar.jpg"} />
                      <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "destructive"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "secondary" : "outline"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => startEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleUpdateUser} className="grid gap-4 py-4">
              <Input
                placeholder="First Name"
                value={editForm.firstName}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
              />
              <Input
                placeholder="Last Name"
                value={editForm.lastName}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={editForm.confirmPassword}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
              />
              <Select
                value={editForm.status}
                onValueChange={(value: UserStatus) =>
                  setEditForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editForm.role}
                onValueChange={(value: UserRole) =>
                  setEditForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                  Profile Picture
                </label>
                <Input type="file" onChange={onEditProfilePictureChange} />
                {editProfilePicture ? (
                  <div className="mt-2 relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(editProfilePicture)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => setEditProfilePicture(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  editingUser.profilePicture && (
                    <div className="mt-2 relative w-24 h-24">
                      <img
                        src={editingUser.profilePicture}
                        alt="Current Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  )
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}




// "use client";

// import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/AuthProvider";

// // Shadcn UI components
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableHead,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";

// // Icons
// import { 
//   Edit, 
//   Trash2, 
//   UserPlus, 
//   X, 
//   Users, 
//   Filter, 
//   List, 
//   Search,
//   Calendar,
//   Shield,
//   User,
//   ChevronRight
// } from "lucide-react";

// // Helper to generate unique IDs for simulated data
// const generateId = () => Math.random().toString(36).substr(2, 9);

// // Initial fake users data
// const initialUsers: User[] = [
//   {
//     id: generateId(),
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     status: "active",
//     role: "user",
//     profilePicture: "https://avatar.iran.liara.run/public/boy?username=john",
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: generateId(),
//     firstName: "Jane",
//     lastName: "Smith",
//     email: "jane.smith@example.com",
//     status: "inactive",
//     role: "admin",
//     profilePicture: "https://avatar.iran.liara.run/public/girl?username=jane",
//     created_at: new Date(Date.now() - 86400000).toISOString(),
//   },
//   {
//     id: generateId(),
//     firstName: "Peter",
//     lastName: "Jones",
//     email: "peter.jones@example.com",
//     status: "active",
//     role: "user",
//     profilePicture: "https://avatar.iran.liara.run/public/boy?username=peter",
//     created_at: new Date(Date.now() - 172800000).toISOString(),
//   },
// ];

// /* -----------------------
//    Types
//    ----------------------- */
// type UserStatus = "active" | "inactive";
// type UserRole = "admin" | "user";

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password?: string;
//   confirmPassword?: string;
//   status: UserStatus;
//   role?: UserRole;
//   profilePicture?: string;
//   created_at?: string;
// }

// interface UserForm {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password?: string;
//   confirmPassword?: string;
//   status: UserStatus;
//   role?: UserRole;
// }

// /* -----------------------
//    Component
//    ----------------------- */
// export default function UsersPage() {
//   const { token, isLoading: authLoading } = useAuth();
//   const router = useRouter();

//   const [users, setUsers] = useState<User[]>(initialUsers);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("users");

//   // Filter states
//   const [filters, setFilters] = useState({
//     name: "",
//     email: "",
//     status: "",
//     role: "",
//     from: "",
//     to: "",
//   });

//   // Create User states
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [createForm, setCreateForm] = useState<UserForm>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     status: "active",
//   });
//   const [createProfilePicture, setCreateProfilePicture] = useState<File | null>(null);

//   // Edit User states
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [editForm, setEditForm] = useState<UserForm>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     status: "active",
//   });
//   const [editProfilePicture, setEditProfilePicture] = useState<File | null>(null);

//   // Authentication check
//   useEffect(() => {
//     if (!authLoading && !token) {
//       router.push("/auth/login");
//     }
//   }, [token, authLoading, router]);

//   /* -----------------------
//      Load Users Function (Simulated)
//      ----------------------- */
//   const loadUsers = async () => {
//     setLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const filteredUsers = initialUsers.filter((user) => {
//       const nameMatch =
//         filters.name === "" ||
//         user.firstName.toLowerCase().includes(filters.name.toLowerCase()) ||
//         user.lastName.toLowerCase().includes(filters.name.toLowerCase());
//       const emailMatch = filters.email === "" || user.email.toLowerCase().includes(filters.email.toLowerCase());
//       const statusMatch = filters.status === "" || user.status === filters.status;
//       const roleMatch = filters.role === "" || user.role === filters.role;

//       return nameMatch && emailMatch && statusMatch && roleMatch;
//     });

//     setUsers(filteredUsers);
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (!authLoading && token) {
//       loadUsers();
//     }
//   }, [token, authLoading, filters]);

//   /* -----------------------
//      Create User Functions (Simulated)
//      ----------------------- */
//   const handleCreateUser = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     let profilePictureUrl: string | undefined = createProfilePicture ? URL.createObjectURL(createProfilePicture) : undefined;

//     try {
//       const newUser: User = {
//         id: generateId(),
//         ...createForm,
//         profilePicture: profilePictureUrl || "https://avatar.iran.liara.run/public/boy",
//         created_at: new Date().toISOString(),
//       };

//       setUsers((prevUsers) => [...prevUsers, newUser]);
//       alert("User created successfully!");
//       setIsCreateDialogOpen(false);
//       setCreateForm({
//         firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
//         status: "active",
//       });
//       setCreateProfilePicture(null);
//     } catch (error: any) {
//       console.error("Create user error:", error);
//       alert(`Failed to create user: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setCreateProfilePicture(e.target.files[0]);
//     }
//   };

//   /* -----------------------
//      Edit User Functions (Simulated)
//      ----------------------- */
//   const startEdit = (user: User) => {
//     setEditingUser(user);
//     setEditForm({
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       password: "",
//       confirmPassword: "",
//       status: user.status,
//       role: user.role,
//     });
//     setEditProfilePicture(null);
//     setIsEditDialogOpen(true);
//   };

//   const handleUpdateUser = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!editingUser) return;
//     setLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     let profilePictureUrl: string | undefined = editingUser.profilePicture;
//     if (editProfilePicture) {
//       profilePictureUrl = URL.createObjectURL(editProfilePicture);
//     }

//     try {
//       const updatedUser: User = {
//         ...editingUser,
//         ...editForm,
//         profilePicture: profilePictureUrl,
//       };

//       setUsers((prevUsers) =>
//         prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
//       );
//       alert("User updated successfully!");
//       setIsEditDialogOpen(false);
//       setEditingUser(null);
//       setEditProfilePicture(null);
//     } catch (error: any) {
//       console.error("Update user error:", error);
//       alert(`Failed to update user: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onEditProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setEditProfilePicture(e.target.files[0]);
//     }
//   };

//   /* -----------------------
//      Delete User Function (Simulated)
//      ----------------------- */
//   const handleDeleteUser = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;
//     setLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     try {
//       setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
//       alert("User deleted successfully!");
//     } catch (error: any) {
//       console.error("Delete user error:", error);
//       alert(`Failed to delete user: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (authLoading || !token) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
//         <div className="relative">
//           <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
//           <div className="relative text-gray-300 text-lg font-medium bg-gray-900/50 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-800">
//             Loading authentication...
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
//       {/* 4D Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 container mx-auto p-6">
//         <div className="flex gap-6">
//           {/* Left Sidebar - 4D Design */}
//           <div className="w-80 space-y-6">
//             {/* Create User Card */}
//             <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl overflow-hidden">
//               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-0 hover:opacity-100 transition duration-500"></div>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <UserPlus className="w-5 h-5 text-blue-400" />
//                   Create User
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg">
//                       <UserPlus className="mr-2 h-4 w-4" /> New User
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
//                     <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-30"></div>
//                     <div className="relative">
//                       <DialogHeader>
//                         <DialogTitle className="text-xl">Create New User</DialogTitle>
//                       </DialogHeader>
//                       <form onSubmit={handleCreateUser} className="grid gap-4 py-4">
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">First Name</label>
//                           <Input
//                             placeholder="John"
//                             value={createForm.firstName}
//                             onChange={(e) => setCreateForm(prev => ({ ...prev, firstName: e.target.value }))}
//                             required
//                             className="bg-gray-800 border-gray-700"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">Last Name</label>
//                           <Input
//                             placeholder="Doe"
//                             value={createForm.lastName}
//                             onChange={(e) => setCreateForm(prev => ({ ...prev, lastName: e.target.value }))}
//                             required
//                             className="bg-gray-800 border-gray-700"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">Email</label>
//                           <Input
//                             type="email"
//                             placeholder="john@example.com"
//                             value={createForm.email}
//                             onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
//                             required
//                             className="bg-gray-800 border-gray-700"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">Password</label>
//                           <Input
//                             type="password"
//                             placeholder="••••••••"
//                             value={createForm.password}
//                             onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
//                             required
//                             className="bg-gray-800 border-gray-700"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">Confirm Password</label>
//                           <Input
//                             type="password"
//                             placeholder="••••••••"
//                             value={createForm.confirmPassword}
//                             onChange={(e) => setCreateForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
//                             required
//                             className="bg-gray-800 border-gray-700"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">Status</label>
//                           <Select value={createForm.status} onValueChange={(value: UserStatus) => setCreateForm(prev => ({ ...prev, status: value }))}>
//                             <SelectTrigger className="bg-gray-800 border-gray-700">
//                               <SelectValue placeholder="Select Status" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-gray-800 border-gray-700">
//                               <SelectItem value="active" className="hover:bg-gray-700">Active</SelectItem>
//                               <SelectItem value="inactive" className="hover:bg-gray-700">Inactive</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">Role</label>
//                           <Select value={createForm.role} onValueChange={(value: UserRole) => setCreateForm(prev => ({ ...prev, role: value }))}>
//                             <SelectTrigger className="bg-gray-800 border-gray-700">
//                               <SelectValue placeholder="Select Role" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-gray-800 border-gray-700">
//                               <SelectItem value="admin" className="hover:bg-gray-700">Admin</SelectItem>
//                               <SelectItem value="user" className="hover:bg-gray-700">User</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">Profile Picture</label>
//                           <Input 
//                             type="file" 
//                             onChange={onProfilePictureChange} 
//                             className="bg-gray-800 border-gray-700 file:text-gray-300"
//                           />
//                           {createProfilePicture && (
//                             <div className="relative w-24 h-24">
//                               <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur"></div>
//                               <img
//                                 src={URL.createObjectURL(createProfilePicture)}
//                                 alt="Preview"
//                                 className="relative w-full h-full object-cover rounded-full"
//                               />
//                             </div>
//                           )}
//                         </div>
//                         <DialogFooter>
//                           <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600">
//                             {loading ? "Creating..." : "Create User"}
//                           </Button>
//                         </DialogFooter>
//                       </form>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </CardContent>
//             </Card>

//             {/* Filters Card */}
//             <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl overflow-hidden">
//               <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl blur opacity-0 hover:opacity-100 transition duration-500"></div>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Filter className="w-5 h-5 text-cyan-400" />
//                   Filters
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium flex items-center gap-2">
//                     <Search className="w-4 h-4" />
//                     Name
//                   </label>
//                   <Input
//                     placeholder="Search by name..."
//                     value={filters.name}
//                     onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
//                     className="bg-gray-800 border-gray-700"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Email</label>
//                   <Input
//                     type="email"
//                     placeholder="Search by email..."
//                     value={filters.email}
//                     onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
//                     className="bg-gray-800 border-gray-700"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Status</label>
//                   <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
//                     <SelectTrigger className="bg-gray-800 border-gray-700">
//                       <SelectValue placeholder="All Status" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-800 border-gray-700">
//                       <SelectItem value="" className="hover:bg-gray-700">All</SelectItem>
//                       <SelectItem value="active" className="hover:bg-gray-700">Active</SelectItem>
//                       <SelectItem value="inactive" className="hover:bg-gray-700">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Role</label>
//                   <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
//                     <SelectTrigger className="bg-gray-800 border-gray-700">
//                       <SelectValue placeholder="All Roles" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-800 border-gray-700">
//                       <SelectItem value="" className="hover:bg-gray-700">All</SelectItem>
//                       <SelectItem value="admin" className="hover:bg-gray-700">Admin</SelectItem>
//                       <SelectItem value="user" className="hover:bg-gray-700">User</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Date Range
//                   </label>
//                   <div className="grid grid-cols-2 gap-2">
//                     <Input
//                       type="date"
//                       value={filters.from}
//                       onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value }))}
//                       className="bg-gray-800 border-gray-700"
//                     />
//                     <Input
//                       type="date"
//                       value={filters.to}
//                       onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
//                       className="bg-gray-800 border-gray-700"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex gap-2 pt-4">
//                   <Button onClick={loadUsers} disabled={loading} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600">
//                     Apply Filters
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setFilters({ name: "", email: "", status: "", role: "", from: "", to: "" })}
//                     disabled={loading}
//                     className="flex-1"
//                   >
//                     Reset
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Quick Stats */}
//             <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Users className="w-5 h-5 text-purple-400" />
//                   User Stats
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
//                   <span className="text-gray-400">Total Users</span>
//                   <span className="text-2xl font-bold text-white">{users.length}</span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
//                   <span className="text-gray-400">Active</span>
//                   <Badge variant="default" className="bg-green-900/30 text-green-400">
//                     {users.filter(u => u.status === 'active').length}
//                   </Badge>
//                 </div>
//                 <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
//                   <span className="text-gray-400">Admins</span>
//                   <Badge variant="secondary" className="bg-blue-900/30 text-blue-400">
//                     {users.filter(u => u.role === 'admin').length}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content - Users List */}
//           <div className="flex-1">
//             {/* Header */}
//             <div className="mb-6">
//               <div className="relative">
//                 <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-xl opacity-50"></div>
//                 <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
//                         <Users className="w-6 h-6" />
//                       </div>
//                       <div>
//                         <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
//                           User Management
//                         </h1>
//                         <p className="text-gray-400">Manage all user accounts and permissions</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Badge variant="outline" className="text-sm">
//                         {users.length} users
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Users Table */}
//             <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl overflow-hidden">
//               <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-2xl blur opacity-0 hover:opacity-100 transition duration-500"></div>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="flex items-center gap-2">
//                     <List className="w-5 h-5" />
//                     Users List
//                   </CardTitle>
//                   {loading && (
//                     <div className="flex items-center gap-2 text-sm text-cyan-400">
//                       <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
//                       Loading...
//                     </div>
//                   )}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="rounded-lg overflow-hidden border border-gray-800/50">
//                   <Table>
//                     <TableHeader className="bg-gray-800/50">
//                       <TableRow className="border-gray-800 hover:bg-transparent">
//                         <TableHead className="text-gray-300">Avatar</TableHead>
//                         <TableHead className="text-gray-300">Name</TableHead>
//                         <TableHead className="text-gray-300">Email</TableHead>
//                         <TableHead className="text-gray-300">Status</TableHead>
//                         <TableHead className="text-gray-300">Role</TableHead>
//                         <TableHead className="text-gray-300">Created</TableHead>
//                         <TableHead className="text-gray-300 text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {users.length === 0 ? (
//                         <TableRow className="border-gray-800 hover:bg-gray-800/30">
//                           <TableCell colSpan={7} className="h-24 text-center text-gray-400">
//                             No users found. Try different filters.
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         users.map((user) => (
//                           <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/30 transition-colors">
//                             <TableCell>
//                               <div className="relative">
//                                 <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur"></div>
//                                 <Avatar className="relative">
//                                   <AvatarImage src={user.profilePicture} />
//                                   <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600">
//                                     {user.firstName.charAt(0)}{user.lastName.charAt(0)}
//                                   </AvatarFallback>
//                                 </Avatar>
//                               </div>
//                             </TableCell>
//                             <TableCell className="font-medium">
//                               <div className="flex items-center gap-2">
//                                 <span>{user.firstName} {user.lastName}</span>
//                                 {user.role === 'admin' && (
//                                   <Shield className="w-4 h-4 text-blue-400" />
//                                 )}
//                               </div>
//                             </TableCell>
//                             <TableCell className="text-gray-300">{user.email}</TableCell>
//                             <TableCell>
//                               <Badge 
//                                 variant="outline" 
//                                 className={
//                                   user.status === 'active' 
//                                     ? 'bg-green-900/20 text-green-400 border-green-800' 
//                                     : 'bg-red-900/20 text-red-400 border-red-800'
//                                 }
//                               >
//                                 {user.status}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>
//                               <Badge 
//                                 variant="outline" 
//                                 className={
//                                   user.role === 'admin' 
//                                     ? 'bg-blue-900/20 text-blue-400 border-blue-800' 
//                                     : 'bg-gray-800 text-gray-300 border-gray-700'
//                                 }
//                               >
//                                 {user.role}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="text-gray-400">
//                               {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <div className="flex justify-end gap-2">
//                                 <Button
//                                   variant="outline"
//                                   size="icon"
//                                   onClick={() => startEdit(user)}
//                                   className="border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300"
//                                 >
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button
//                                   variant="outline"
//                                   size="icon"
//                                   onClick={() => handleDeleteUser(user.id)}
//                                   className="border-red-800 text-red-400 hover:bg-red-900/30 hover:text-red-300"
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Edit User Dialog */}
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
//             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg blur opacity-30"></div>
//             <div className="relative">
//               <DialogHeader>
//                 <DialogTitle className="text-xl">Edit User</DialogTitle>
//               </DialogHeader>
//               {editingUser && (
//                 <form onSubmit={handleUpdateUser} className="grid gap-4 py-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">First Name</label>
//                     <Input
//                       placeholder="First Name"
//                       value={editForm.firstName}
//                       onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
//                       required
//                       className="bg-gray-800 border-gray-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Last Name</label>
//                     <Input
//                       placeholder="Last Name"
//                       value={editForm.lastName}
//                       onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
//                       required
//                       className="bg-gray-800 border-gray-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Email</label>
//                     <Input
//                       type="email"
//                       placeholder="Email"
//                       value={editForm.email}
//                       onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
//                       required
//                       className="bg-gray-800 border-gray-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Password (Leave empty to keep current)</label>
//                     <Input
//                       type="password"
//                       placeholder="Password"
//                       value={editForm.password}
//                       onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
//                       className="bg-gray-800 border-gray-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Confirm Password</label>
//                     <Input
//                       type="password"
//                       placeholder="Confirm Password"
//                       value={editForm.confirmPassword}
//                       onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
//                       className="bg-gray-800 border-gray-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Status</label>
//                     <Select value={editForm.status} onValueChange={(value: UserStatus) => setEditForm(prev => ({ ...prev, status: value }))}>
//                       <SelectTrigger className="bg-gray-800 border-gray-700">
//                         <SelectValue placeholder="Select Status" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-800 border-gray-700">
//                         <SelectItem value="active" className="hover:bg-gray-700">Active</SelectItem>
//                         <SelectItem value="inactive" className="hover:bg-gray-700">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Role</label>
//                     <Select value={editForm.role} onValueChange={(value: UserRole) => setEditForm(prev => ({ ...prev, role: value }))}>
//                       <SelectTrigger className="bg-gray-800 border-gray-700">
//                         <SelectValue placeholder="Select Role" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-800 border-gray-700">
//                         <SelectItem value="admin" className="hover:bg-gray-700">Admin</SelectItem>
//                         <SelectItem value="user" className="hover:bg-gray-700">User</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Profile Picture</label>
//                     <Input 
//                       type="file" 
//                       onChange={onEditProfilePictureChange} 
//                       className="bg-gray-800 border-gray-700 file:text-gray-300"
//                     />
//                     {editProfilePicture ? (
//                       <div className="relative w-24 h-24">
//                         <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur"></div>
//                         <img
//                           src={URL.createObjectURL(editProfilePicture)}
//                           alt="Preview"
//                           className="relative w-full h-full object-cover rounded-full"
//                         />
//                       </div>
//                     ) : editingUser.profilePicture && (
//                       <div className="relative w-24 h-24">
//                         <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur"></div>
//                         <img
//                           src={editingUser.profilePicture}
//                           alt="Current Profile"
//                           className="relative w-full h-full object-cover rounded-full"
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <DialogFooter>
//                     <Button type="submit" disabled={loading} className="bg-gradient-to-r from-cyan-600 to-blue-600">
//                       {loading ? "Updating..." : "Update User"}
//                     </Button>
//                   </DialogFooter>
//                 </form>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }