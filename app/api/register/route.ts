import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";

export async function POST(req: Request) {
  const { username, email, password, role } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ error: "This username has already taken" }, { status: 400 });
      }
      if (existingUser.email === email) {
        return NextResponse.json({ error: "This email has already been used" }, { status: 400 });
      }
    }

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, role: "CUSTOMER" },
    });
    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
