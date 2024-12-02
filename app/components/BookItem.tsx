"use client";

import Link from "next/link";

type BookItemProps = {
  index: number;
  id: string;
  title: string;
  author: string;
  price: string;
  image: string | null;
  deleteBook: (id: string) => void;
};

export default function BookItem({ index, id, title, author, price, image, deleteBook }: BookItemProps) {

  const imagePath = image ? image.startsWith("/uploads/") ? image : `/uploads/${image}` : null;
  console.log("Resolved Image Path:", imagePath);

  return (
    <div className="flex flex-col items-center justify-between bg-white p-4 shadow-md rounded-md my-4 w-80 h-100">
      {imagePath ? (
        <img src={imagePath} alt="Book Image" className="w-50 h-64 object-cover rounded-md mb-4" />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-600 font-bold rounded-md mb-4">
          No Image Available
        </div>
      )}
      <div className="text-center mb-4">
        <span className="font-semibold text-black block">{index + 1}. {title}</span>
        <span className="text-gray-700 block">by {author}</span>
        <span className="text-green-600 font-bold block">${price}</span>
      </div>
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
    </div>
  );
}
