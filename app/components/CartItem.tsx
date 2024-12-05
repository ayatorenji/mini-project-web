"use client";

import React, { useEffect, useState } from "react";

export default function CartItem ({ userId }: { userId: string }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await fetch("/api/carts", {
        headers: { "user-id": userId },
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    };

    fetchCartItems();
  }, [userId]);

  return (
    <div className="cart-dropdown bg-white p-4 shadow-md rounded">
      <h3>Your Cart</h3>
      {cartItems.map((item: any) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <p>{item.Book.title} by {item.Book.author}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
};