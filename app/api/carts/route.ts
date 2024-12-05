import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(req: Request) {
  const { userId, bookId } = await req.json();

  try {
    const existingItem = await prisma.cart.findFirst({
      where: { userId, bookId },
    });

    if (existingItem) {
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
      });
      return NextResponse.json({ message: "Cart updated", cartItem: updatedCartItem }, { status: 200 });
    } else {
      const newCartItem = await prisma.cart.create({
        data: { userId, bookId, quantity: 1 },
      });
      return NextResponse.json({ message: "Book added to cart", cartItem: newCartItem }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const userId = req.headers.get("user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { Book: true },
    });
    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { id: cartItemId, increment } = await req.json();

  try {
    const cartItem = await prisma.cart.findUnique({ where: { id: cartItemId } });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    const updatedQuantity = increment
      ? cartItem.quantity + 1
      : Math.max(cartItem.quantity - 1, 0);

    if (updatedQuantity === 0) {
      // If the quantity becomes 0, remove the cart item
      await prisma.cart.delete({ where: { id: cartItemId } });
      return NextResponse.json({ removed: true, id: cartItemId, message: "The book from cart has been removed" }, { status: 200 });
    } else {
      // Update the cart item quantity
      const updatedCartItem = await prisma.cart.update({
        where: { id: cartItemId },
        data: { quantity: updatedQuantity },
        include: { Book: true },
      });
      return NextResponse.json(updatedCartItem, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = req.headers.get("user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await prisma.cart.deleteMany({
      where: { userId },
    });
    return NextResponse.json({ message: "Cart cleared successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
