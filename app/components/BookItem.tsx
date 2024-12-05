"use client";

import Link from "next/link";

type BookItemProps = {
  index: number;
  id: string;
  title: string;
  author: string;
  price: string;
  image: string | null;
  currentUser: { id: string; username: string; role: string } | null;
  deleteBook: (id: string) => void;
  fetchCart: () => void
};

export default function BookItem({ index, id, title, author, price, image, currentUser, deleteBook, fetchCart, }: BookItemProps) {

  const imagePath = image ? image.startsWith("/uploads/") ? image : `/uploads/${image}` : null;
  console.log("Resolved Image Path:", imagePath);

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const response = await fetch("/api/carts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, bookId: id }),
    });

    if (response.ok) {
      alert("Book added to cart");
      fetchCart();
    } else {
      alert("Failed to add book to cart");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between bg-white p-4 shadow-md rounded-md my-4 w-80 h-100">
      {imagePath ? (
        <img src={imagePath} alt={title} className="w-50 h-64 object-cover rounded-md mb-4" />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-600 font-bold rounded-md mb-4">
          No Image
        </div>
      )}
      <div className="text-center mb-4">
        <span className="font-semibold text-black block">{index + 1}. {title}</span>
        <span className="text-gray-700 block">by {author}</span>
        <span className="text-green-600 font-bold block">${price}</span>
      </div>
      {currentUser?.role === "ADMIN" && (
        <div className="flex justify-between w-full">
          <button
            onClick={() => deleteBook(id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all"
          >
            Delete
          </button>
          <Link
            href={{
              pathname: "/books/edit",
              query: { id },
            }}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-all"
          >
            Edit
          </Link>
        </div>
      )}
      {currentUser?.role !== "ADMIN" && (
        <button onClick={handleAddToCart} className="bg-blue-600 px-3 py-2 text-white mt-2 rounded hover:bg-green-500 ">
          Add to Cart
        </button>
      )}
    </div>
  );
}
