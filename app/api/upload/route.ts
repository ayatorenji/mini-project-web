import { NextResponse } from "next/server";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

// Configure Multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: (error: Error | null, destination: string) => void) => {
      const uploadPath = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: (error: Error | null, filename: string) => void) => {
      const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueFilename);
    },
  }),
});

// Middleware handler for multer
function runMulter(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, {} as any, (err: any) => {
      if (err) return reject(err);
      resolve(req.file);
    });
  });
}

export async function POST(req: any) {
  try {
    // Run multer to handle the file upload
    const file: Express.Multer.File = (await runMulter(req)) as Express.Multer.File;
    const filePath = `/uploads/${file.filename}`;
    return NextResponse.json({ filePath }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
