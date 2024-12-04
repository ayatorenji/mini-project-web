import React from "react";
import Link from "next/link";

export default function MainPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-black">
          Welcome to Jester Books Store!
        </h1>
        <div className="flex flex-col gap-4">
          <Link href="/login">
            <button className="w-full bg-blue-500 font-bold text-white py-2 rounded hover:bg-green-600 transition duration-300">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="w-full bg-blue-500 font-bold text-white py-2 rounded hover:bg-green-600 transition duration-300">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
