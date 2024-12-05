"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Book = {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string | null;
};

type OrderItem = {
  id: string;
  quantity: number;
  Book: Book;
};

type Order = {
  id: string;
  orderCode: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  User?: { username: string };
};

export default function StatusPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/me");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
        setUserId(data.id);
        return true;
      }
      return false;
    };

    const fetchOrders = async () => {
      if (!userId || !userRole) return;
      const response = await fetch("/api/orders", {
        headers: {
          "user-id": userId,
          "user-role": userRole,
        },
      });

      if (response.ok) {
        const data: Order[] = await response.json();
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(data);
      } else {
        console.error("Failed to fetch orders");
      }
    };

    fetchUser().then((userFetched) => {
        if (userFetched) fetchOrders();
      });
  }, [userId, userRole]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const response = await fetch(`/api/orders`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });

    if (response.ok) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } else {
      console.error("Failed to update order status");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
            {userRole === "ADMIN" ? "Manage the orders" : "Order Status"}
        </h1>
        <button
            onClick={() => router.push("/books")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
            Back to the bookstore
        </button>
      </div>
      {orders.map((order) => (
        <div key={order.id} className="mb-4 border p-4 rounded">
          <h2 className="font-bold">
            Order {order.orderCode} by {userRole === "ADMIN" ? order.User?.username : "You"}
          </h2>
          <p className="mt-2 mb-2">
            Status:{" "}
            <span
                className={`p-2 rounded text-black font-bold w-fit mb-2 ${
                order.status === "Waiting"
                    ? "bg-yellow-300"
                    : order.status === "Approved"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
            >
                {order.status}
            </span>
          </p>
          <table className="table-auto w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="w-1/6">Book Cover</th>
                <th className="w-1/6">Book Title</th>
                <th className="w-1/6">Author</th>
                <th className="w-1/6">Price</th>
                <th className="w-1/6">Quantity</th>
                {userRole === "ADMIN" && <th className="w-1/6">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="text-center">
                    <img src={item.Book.image || "/placeholder.jpg"} alt={item.Book.title} className="w-16 h-16 mx-auto" />
                  </td>
                  <td>{item.Book.title}</td>
                  <td>{item.Book.author}</td>
                  <td>${item.Book.price}</td>
                  <td>{item.quantity}</td>
                  {userRole === "ADMIN" && (
                    <td className="flex justify-center gap-4">
                        <button
                            onClick={() => handleStatusChange(order.id, "Approved")}
                            className="bg-green-500 text-white px-4 py-2 rounded border border-green-700 hover:bg-green-600 transition"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => handleStatusChange(order.id, "Denied")}
                            className="bg-red-500 text-white px-4 py-2 rounded border border-red-700 hover:bg-red-600 transition"
                        >
                            Deny
                        </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}