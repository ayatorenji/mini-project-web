import React from "react";
import BookItem from "../components/BookItem";
import prisma from "@/utils/db";

export default async function BookListPage() {
    const books = await prisma.book.findMany();

    const deleteBook = async (id: string) => {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      window.location.reload();
    };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Manage Books</h1>
      <div>
        {books.map((book, index) => (
          <BookItem
            key={book.id}
            index={index}
            id={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            image={book.image}
            deleteBook={deleteBook}
          />
        ))}
      </div>
    </div>
  );
}
