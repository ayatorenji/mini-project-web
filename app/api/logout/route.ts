import { NextResponse } from "next/server";

export async function POST() {
  const headers = new Headers();
  headers.append("Set-Cookie", "token=; Max-Age=0; path=/; HttpOnly; Secure");

  return NextResponse.json({ message: "Successfully logged out" }, { headers });
}
