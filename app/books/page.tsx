"use client";

import React, { useState } from "react";
import BookItem from "../components/BookItem";

export default function BookListPage() {
  const [books, setBooks] = useState([
    { id: "1", title: "Book One", author: "Author One", price: "$10" },
    { id: "2", title: "Book Two", author: "Author Two", price: "$15" },
    { id: "3", title: "Book Three", author: "Author Three", price: "$20" },
  ]);

  const deleteBook = (id: string) => {
    setBooks(books.filter((book) => book.id !== id));
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
            deleteBook={deleteBook}
          />
        ))}
      </div>
    </div>
  );
}
