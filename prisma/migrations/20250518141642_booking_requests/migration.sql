-- CreateTable
CREATE TABLE "OnboardingRequests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotelname" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "hoteladminemail" TEXT NOT NULL,
    "hoteldescription" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hotel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "adminemail" TEXT NOT NULL,
    "description" TEXT,
    "rating" INTEGER
);
INSERT INTO "new_Hotel" ("adminemail", "description", "id", "name", "place", "rating") SELECT "adminemail", "description", "id", "name", "place", "rating" FROM "Hotel";
DROP TABLE "Hotel";
ALTER TABLE "new_Hotel" RENAME TO "Hotel";
CREATE UNIQUE INDEX "Hotel_name_key" ON "Hotel"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
