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

type CartItemType = {
  id: string;
  Book: Book;
  quantity: number;
};

type CurrentUser = {
  id: string;
  username: string;
  role: string;
};

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [cartOpen, setCartOpen] = useState(false); 
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
        setCurrentUser(data);
      } else {
        alert("Please log in first!");
        router.push("/login");
      }
    };
    fetchBooks();
    fetchCurrentUser();
  }, [router]);

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    }
  }, [currentUser]);

  const fetchCart = async () => {
    if (!currentUser) {
      console.error("User is not logged in");
      return;
    }
    const response = await fetch("/api/carts", {
      headers: { "user-id": currentUser.id },
    });
    if (response.ok) {
      const data: CartItemType[] = await response.json();
      setCartItems(data);
    } else {
      console.error("Failed to fetch cart items");
    }
  };

  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      alert("You must be logged in to place an order.");
      return;
    }
  
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          items: cartItems.map((item) => ({
            bookId: item.Book.id,
            quantity: item.quantity,
          })),
        }),
      });
  
      if (response.ok) {
        await fetch("/api/carts", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "user-id": currentUser.id },
        });

        alert("Order placed successfully!");
        setCartItems([]);
        router.push("/status");
      } else {
        console.error("Failed to submit the order.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };  

  const handleQuantityChange = async (cartItemId: string, increment: boolean) => {
    const response = await fetch("/api/carts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cartItemId, increment }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.removed) {
      // Remove the item from the cart on the frontend
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.id !== data.id)
        );
      } else {
        // Refetch the cart to update quantities
        fetchCart();
      }
    } else {
      console.error("Failed to update quantity.");
    }
  };

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

  if (currentUser?.role === "ADMIN") {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Manage Books</h1>
          {currentUser && (
            <div className="text-white">
              <button onClick={() => router.push("/status")} className="mr-4 text-lg bg-gray-800 px-3 py-2 rounded hover:bg-gray-700">
                ⚙️
              </button>
              Welcome, {currentUser.username} {" "}
              {currentUser.role === "ADMIN" && "[Admin]"} |{" "}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-4">
          {books.map((book, index) => (
            <BookItem
              key={book.id}
              index={index}
              id={book.id}
              title={book.title}
              author={book.author}
              price={book.price}
              image={book.image || null}
              currentUser={currentUser}
              deleteBook={confirmDeleteBook}
              fetchCart={fetchCart}
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
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center mb-4">
          <img
            src="/assets/book.png"
            alt="Book Logo"
            className="w-8 h-8 mr-2"
          />
          <h1 className="text-2xl font-bold text-white">Jester Books Store</h1>
        </div>
        {currentUser && (
          <div className="text-white">
            <button onClick={() => router.push("/status")} className="mr-4 text-lg bg-gray-800 px-3 py-2 rounded hover:bg-gray-700">
              📜
            </button>
            <button
              onClick={handleCartToggle}
              className="mr-4 text-lg bg-gray-800 px-3 py-2 rounded hover:bg-gray-700"
            >
              🛒
            </button>
            Welcome, {currentUser.username} |{" "}
            <button
              onClick={handleLogout}
              className="text-blue-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {cartOpen && (
        <div
          className="cart-dropdown absolute top-20 right-5 w-[30%] max-h-[60vh] bg-white shadow-md rounded-l-md overflow-hidden flex flex-col"
          style={{ zIndex: 1000 }}
        >
          <div className="overflow-y-auto flex-1 p-4">
            <h3 className="font-bold mb-2 text-black">Your Cart</h3>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-2 border-b"
                >
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={item.Book.image || "/placeholder.jpg"}
                      alt={item.Book.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 ml-4">
                    <p className="text-black">{item.Book.title}</p>
                    <p className="text-sm text-black">by {item.Book.author}</p>
                    <p className="text-green-600 font-bold">${item.Book.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, false)}
                      className="bg-blue-600 px-2 py-1 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="px-2 text-black">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, true)}
                      className="bg-blue-600 px-2 py-1 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black">Your cart is empty.</p>
            )}
          </div>
          <div className="p-4 border-t bg-gray-100 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-500"
            >
              Submit Order
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-4">
        {books.map((book, index) => (
          <BookItem
            key={book.id}
            index={index}
            id={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            image={book.image || null}
            currentUser={currentUser}
            deleteBook={confirmDeleteBook}
            fetchCart={fetchCart}
          />
        ))}
      </div>
    </div>
  );
}
