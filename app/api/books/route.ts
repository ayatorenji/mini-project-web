import prisma from "@/utils/db";

export async function GET() {
  const books = await prisma.book.findMany();
  return new Response(JSON.stringify(books), { status: 200 });
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log("Book data received:", data);
  const newBook = await prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      price: data.price,
      image: data.image,
    },
  });
  console.log("Book created in database:", newBook); 
  return new Response(JSON.stringify(newBook), { status: 201 });
}

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const data = await req.json();
  const updatedBook = await prisma.book.update({
    where: { id: id! },
    data: {
      title: data.title,
      author: data.author,
      price: data.price,
      image: data.image, // Ensure this field is updated
    },
  });
  return new Response(JSON.stringify(updatedBook), { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Book ID is required" }), { status: 400 });
  }
  await prisma.book.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
  