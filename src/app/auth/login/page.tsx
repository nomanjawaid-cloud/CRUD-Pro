// with using fack mok api data
"use client";

import { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { token, login } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_LOGIN_API}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           email: formData.email,
  //           password: formData.password,
  //         }),
  //       },
  //     );

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.message || "Invalid credentials");
  //       setLoading(false);
  //       return;
  //     }

  //     console.log("Login Response:", data);
  //     alert("Login Successful!");

  //     // Store the token using AuthProvider's login function
  //     login(data.token); // Assuming 'data' contains a 'token' field

  //     router.push("/dashboard");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Something went wrong");
  //   }

  //   setLoading(false);
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call for testing
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_LOGIN_API}`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       email: formData.email,
      //       password: formData.password,
      //     }),
      //   },
      // );

      // if (!res.ok) {
      //   const errorData = await res.json();
      //   alert(errorData.message || "Login failed!");
      //   return;
      // }

      // const data = await res.json();
      // login(data.token);

      // Simulate successful login after a short delay
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      login("fake-jwt-token"); // Store a fake token
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  if (token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-gray-200 shadow rounded-2xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
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
          />{" "}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50 rounded-full  "
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?
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

// // with backend api call using .env

// "use client";

// import { useState, FormEvent, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/AuthProvider";

// interface LoginForm {
//   email: string;
//   password: string;
// }

// export default function LoginForm() {
//   const router = useRouter();
//   const { token, login } = useAuth();
//   const [formData, setFormData] = useState<LoginForm>({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (token) {
//       router.push("/dashboard");
//     }
//   }, [token, router]);

//   const handleInputChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_LOGIN_API}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: formData.email,
//             password: formData.password,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Invalid credentials");
//         setLoading(false);
//         return;
//       }

//       console.log("Login Response:", data);

//       // Store the token using AuthProvider's login function
//       login(data.token); // Assuming 'data' contains a 'token' field

//       router.push("/dashboard");
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong");
//     }

//     setLoading(false);
//   };

//   if (token) return null;

//   return (
//     <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full p-6 bg-white shadow rounded-2xl">
//         <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
//           Log In
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-3">
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
//           <button
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded disabled:opacity-50 transition"
//           >
//             {loading ? "Logging In..." : "Log In"}
//           </button>
//           <div className="text-center">
//             <p className="text-sm text-gray-700">
//               Don't have an account?
//               <Link
//                 href="/auth/register"
//                 className="text-indigo-600 underline ml-1"
//               >
//                 Register here
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
