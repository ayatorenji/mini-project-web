"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditBookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    author: "",
    price: "",
    image: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const bookId = searchParams.get("id");

  useEffect(() => {
    if (bookId) {
      // Fetch book data
      const fetchBook = async () => {
        try {
          const response = await fetch(`/api/books?id=${bookId}`);
          if (!response.ok) {
            console.error("Failed to fetch book data");
            return;
          }
          const data = await response.json();
          setFormData({
            id: bookId,
            title: data.title,
            author: data.author,
            price: data.price,
            image: data.image || "",
          });
        } catch (error) {
          console.error("Error fetching book:", error);
        }
      };
      fetchBook();
    }
  }, [bookId]);

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
      if (data.filePath) {
        setFormData((prevData) => ({
          ...prevData,
          image: data.filePath, // Update the image path
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`/api/books`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.id, // Include the ID in the body
          title: formData.title,
          author: formData.author,
          price: formData.price,
          image: formData.image,
        }),
      });
  
      if (!response.ok) {
        console.error("Failed to update book");
        return;
      }
  
      const updatedBook = await response.json();
      console.log("Book updated successfully:", updatedBook);
  
      router.push("/books"); // Redirect back to the books page
    } catch (error) {
      console.error("Error updating book:", error);
    }
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
