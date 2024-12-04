"use client";

import React, { useEffect, useState } from "react";
import BookItem from "../components/BookItem";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Book = {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string | null;
};

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch("/api/books", {
        credentials: "include",
      });
      if (response.ok) {
        const data: Book[] = await response.json();
        setBooks(data);
      } else {
        alert("Please log in first!");
        router.push("/login");
      }
    };
    const fetchCurrentUser = async () => {
      const response = await fetch("/api/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.username);
      } else {
        alert("Please log in first!");
        router.push("/login");
      }
    };
    fetchBooks();
    fetchCurrentUser();
  }, [router]);


  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      alert("Successfully logged out.");
      setCurrentUser(null);
      router.push("/");
    } else {
      alert("Failed to log out.");
    }
  };

  const confirmDeleteBook = (id: string) => {
    setBookToDelete(id);
    setShowModal(true);
  };

  const deleteBook = async () => {
    if (!bookToDelete) return;

    const response = await fetch(`/api/books?id=${bookToDelete}`, { 
      method: "DELETE",
      credentials: "include",
    });
  
    if (response.ok) {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookToDelete));
      console.log(`Book with ID ${bookToDelete} deleted successfully.`);
    } else {
      console.error("Failed to delete book");
    }
    setShowModal(false);
    setBookToDelete(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setBookToDelete(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Manage Books</h1>
        {currentUser && (
          <div className="text-white">
            Welcome, {currentUser} |{" "}
            <button
              onClick={handleLogout}
              className="text-blue-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div className="mb-4">
        <Link href="/books/add">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all">
            Add New Book
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {books.map((book, index) => (
          <BookItem
            key={book.id}
            index={index}
            id={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            image={book.image || null}
            deleteBook={confirmDeleteBook}
          />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4 text-black">Delete this book?</h2>
            <p className="mb-4 text-black">Do you really want to delete this book? This action cannot be undone.</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all mr-2"
              >
                Cancel
              </button>
              <button
                onClick={deleteBook}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
