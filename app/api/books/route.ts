import prisma from "@/utils/db";

export async function GET() {
  const books = await prisma.book.findMany();
  return new Response(JSON.stringify(books), { status: 200 });
}

export async function POST(req: Request) {
  const data = await req.json();
  const newBook = await prisma.book.create({
    data,
  });
  return new Response(JSON.stringify(newBook), { status: 201 });
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Book ID is required" }), { status: 400 });
  }
  await prisma.book.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
  