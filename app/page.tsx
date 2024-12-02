import React from 'react';

const books = [
  { id: 1, title: 'Book One', author: 'Author One', price: '$10' },
  { id: 2, title: 'Book Two', author: 'Author Two', price: '$15' },
  { id: 3, title: 'Book Three', author: 'Author Three', price: '$20' },
];

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Bookstore</h1>
          <nav>
            <a href="/admin" className="text-white mr-4">
              Admin
            </a>
            <a href="/customer" className="text-white">
              Customer
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Available Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-800 font-bold">{book.price}</p>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Bookstore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
