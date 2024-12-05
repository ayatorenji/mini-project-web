import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(req: Request) {
  try {
    const { userId, items } = await req.json();

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid data: userId or items missing" },
        { status: 400 }
      );
    }

    const newOrder = await prisma.order.create({
      data: {
        userId,
        items: {
          create: items.map((item: { bookId: string; quantity: number }) => ({
            bookId: item.bookId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: { include: { Book: true } },
        User: { select: { username: true } },
      },
    });

    return NextResponse.json({ message: "Order created", order: newOrder }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("user-id");
    const role = req.headers.get("user-role");

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: role === "ADMIN" ? {} : { userId: userId || undefined },
      include: {
        items: { include: { Book: true } },
        User: { select: { username: true } },
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
