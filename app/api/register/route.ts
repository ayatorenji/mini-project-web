import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";

export async function POST(req: Request) {
  const { username, email, password, role } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, role },
    });
    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
