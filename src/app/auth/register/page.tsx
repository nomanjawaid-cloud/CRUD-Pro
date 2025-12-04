// with fake moc api call
"use client";

import { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider"; // Import useAuth

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const router = useRouter();
  const { token, login } = useAuth(); // Get login function from useAuth
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.password,
      };

      // Simulate API call for testing
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_SIGNUP_API}`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(payload),
      //   },
      // );

      // if (!res.ok) {
      //   const errorData = await res.json();
      //   alert(errorData.message || "Registration failed!");
      //   return;
      // }

      // const data = await res.json();

      // Simulate successful registration after a short delay
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      // For registration, we might directly log in or redirect to login. Let's redirect to login.
      router.push("/auth/login"); // Redirect to login after simulated registration

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  if (token) {
    return null; // Don't render if already logged in (redirect handled by useEffect)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 ">
      <div className="max-w-md w-full p-6 bg-gray-200 shadow rounded-2xl">
        <h1 className="text-3xl font-extrabold mb-4 text-center">Register</h1>


        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
          />

          <button
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50 rounded-full"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="text-center">
            <p className="text-sm">
              Already have an account?
              <Link href="/auth/login" className="text-blue-700 underline ml-1">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>

  );
}

// // backend api call
// "use client";

// import { useState, FormEvent, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/AuthProvider";

// interface RegisterData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// export default function Register() {
//   const router = useRouter();
//   const { token } = useAuth();
//   const [formData, setFormData] = useState<RegisterData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (token) {
//       router.push("/dashboard");
//     }
//   }, [token, router]);

//   const handleInputChange = (name: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     setLoading(true);

//     const payload = {
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       email: formData.email,
//       password: formData.password,
//     };

//     try {
//       // Backend API call
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_SIGNUP_API}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) {
//         const errorData = await res.json();
//         alert(errorData.message || "Registration failed!");
//         return;
//       }

//       // Success
//       alert("Registered successfully!");
//       router.push("/auth/login");
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (token) return null;

//   return (
//     <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full p-6 bg-white shadow rounded">
//         <h1 className="text-3xl font-extrabold mb-4 text-center text-gray-800">
//           Register
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <Input
//             type="text"
//             placeholder="First Name"
//             value={formData.firstName}
//             onChange={(e) => handleInputChange("firstName", e.target.value)}
//           />
//           <Input
//             type="text"
//             placeholder="Last Name"
//             value={formData.lastName}
//             onChange={(e) => handleInputChange("lastName", e.target.value)}
//           />
//           <Input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => handleInputChange("email", e.target.value)}
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={(e) => handleInputChange("password", e.target.value)}
//           />
//           <Input
//             type="password"
//             placeholder="Confirm Password"
//             value={formData.confirmPassword}
//             onChange={(e) =>
//               handleInputChange("confirmPassword", e.target.value)
//             }
//           />

//           <button
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded disabled:opacity-50 transition"
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>

//           <div className="text-center">
//             <p className="text-sm text-gray-700">
//               Already have an account?
//               <Link href="/auth/login" className="text-indigo-600 underline ml-1">
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
