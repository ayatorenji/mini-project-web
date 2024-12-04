"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "CUSTOMER"]),
});

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      registerSchema.parse(formData);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        setError("Registration failed");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid input");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
         
         type="email"
         name="email"
         value={formData.email}
         onChange={handleChange}
         placeholder="Email"
         className="w-full p-2 mb-4 border rounded"
       />
       <input
         type="password"
         name="password"
         value={formData.password}
         onChange={handleChange}
         placeholder="Password"
         className="w-full p-2 mb-4 border rounded"
       />
       <select
         name="role"
         value={formData.role}
         onChange={handleChange}
         className="w-full p-2 mb-4 border rounded"
       >
         <option value="CUSTOMER">Customer</option>
         <option value="ADMIN">Admin</option>
       </select>
       <button
         type="submit"
         className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
       >
         Register
       </button>
     </form>
   </div>
 );
}
