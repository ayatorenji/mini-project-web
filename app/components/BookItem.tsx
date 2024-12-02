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
    <div key={id} className="flex items-center justify-between bg-white p-4 shadow-md rounded-md my-2">
      {imagePath ? (
        <img src={imagePath} alt="Book Image" className="w-16 h-16 object-cover mr-4" />
      ) : (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-600 font-bold mr-4">
          No Image Available
        </div>
      )}
      <div>
        <span className="font-semibold text-black">{index + 1}.</span> <span className="font-semibold text-black"> {title} by {author} -{" "} </span>
        <span className="text-green-600 font-bold">{price}</span>
      </div>
      <div className="flex items-center">
        {/* Delete Button */}
        <button
          onClick={() => deleteBook(id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all mr-2"
        >
          Delete
        </button>
        {/* Edit Link */}
        <Link
          href={{
            pathname: "/books/edit",
            query: { id, title, author, price },
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
