import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import prisma from "@/utils/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookie = serialize("token", user.id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  const headers = new Headers();
  headers.append("Set-Cookie", cookie);

  return NextResponse.json(
    { message: "Login successful" },
    { headers }
  );
}
