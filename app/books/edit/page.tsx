"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    author: "",
    price: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFormData({
      id: params.get("id") || "",
      title: params.get("title") || "",
      author: params.get("author") || "",
      price: params.get("price") || "",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock updating the book
    console.log("Updated Book Data:", formData);
    // Redirect to the book list page after saving
    router.push("/books");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Edit Book</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="author">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => router.push("/books")}
          className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
