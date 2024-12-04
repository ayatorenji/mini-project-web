import React from "react";
import Link from "next/link";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Bookstore</h1>
          <nav>
            <Link href="/login">
              <button className="text-white mr-4">Login</button>
            </Link>
            <Link href="/register">
              <button className="text-white">Register</button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Welcome to Bookstore</h2>
        <p className="text-gray-600">Please log in or register to access books.</p>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Bookstore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
