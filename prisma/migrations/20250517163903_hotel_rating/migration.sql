/*
  Warnings:

  - Added the required column `rating` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hotel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "adminemail" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL
);
INSERT INTO "new_Hotel" ("adminemail", "description", "id", "name", "place") SELECT "adminemail", "description", "id", "name", "place" FROM "Hotel";
DROP TABLE "Hotel";
ALTER TABLE "new_Hotel" RENAME TO "Hotel";
CREATE UNIQUE INDEX "Hotel_name_key" ON "Hotel"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
