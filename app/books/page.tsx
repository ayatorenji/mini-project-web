"use client";

import React, { useEffect, useState } from "react";
import BookItem from "../components/BookItem";
import Link from "next/link";

type Book = {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string | null;
};

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch("/api/books");
      const data: Book[] = await response.json();
      setBooks(data);
    };
    fetchBooks();
  }, []);

  const deleteBook = async (id: string) => {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Manage Books</h1>
      <div className="mb-4">
        <Link href="/books/add">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all">
            Add New Book
          </button>
        </Link>
      </div>
      <div>
        {books.map((book, index) => (
          <BookItem
            key={book.id}
            index={index}
            id={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            image={book.image || null}
            deleteBook={deleteBook}
          />
        ))}
      </div>
    </div>
  );
}
