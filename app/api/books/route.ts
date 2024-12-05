import prisma from "@/utils/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id"); // Fetch book ID from query parameters

  if (id) {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
      });

      if (!book) {
        return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
      }

      return new Response(JSON.stringify(book), { status: 200 });
    } catch (error) {
      console.error("Error fetching book:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch book" }), { status: 500 });
    }
  }

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
  try {
    const data = await req.json();

    const id = data.id; // Extract ID from the request body
    if (!id) {
      return new Response(JSON.stringify({ error: "Book ID is required" }), { status: 400 });
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: data.title,
        author: data.author,
        price: data.price,
        image: data.image,
      },
    });

    return new Response(JSON.stringify(updatedBook), { status: 200 });
  } catch (error) {
    console.error("Error updating book:", error);
    return new Response(JSON.stringify({ error: "Failed to update book" }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  console.log("Deleting book with ID:", id);

  if (!id) {
    return new Response(JSON.stringify({ error: "Book ID is required" }), { status: 400 });
  }

  try {
    await prisma.book.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting book:", error);
    return new Response(JSON.stringify({ error: "Failed to delete book" }), { status: 500 });
  }
}