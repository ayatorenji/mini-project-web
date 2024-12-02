/*
  Warnings:

  - Added the required column `image` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL
);
INSERT INTO "new_Book" ("author", "id", "price", "title") SELECT "author", "id", "price", "title" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
