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
    image: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFormData({
      id: params.get("id") || "",
      title: params.get("title") || "",
      author: params.get("author") || "",
      price: params.get("price") || "",
      image: params.get("image") || "",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.imageUrl) {
        setFormData((prevData) => ({
          ...prevData,
          image: data.imageUrl,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/books/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.title,
        author: formData.author,
        price: formData.price,
        image: formData.image,
      }),
    });
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
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="image">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {formData.image && (
          <div className="mb-4">
            <img src={formData.image} alt="Book Image" className="w-32 h-32 object-cover" />
          </div>
        )}
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
