/*
  Warnings:

  - Added the required column `booking_count` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_of_guests` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `count` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_of_guests` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomid" TEXT NOT NULL,
    "startdate" DATETIME NOT NULL,
    "enddate" DATETIME NOT NULL,
    "bookinguserid" TEXT NOT NULL,
    "hotelid" TEXT NOT NULL,
    "booking_count" INTEGER NOT NULL,
    "no_of_guests" INTEGER NOT NULL,
    CONSTRAINT "Bookings_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bookings" ("bookinguserid", "enddate", "hotelid", "id", "roomid", "startdate") SELECT "bookinguserid", "enddate", "hotelid", "id", "roomid", "startdate" FROM "Bookings";
DROP TABLE "Bookings";
ALTER TABLE "new_Bookings" RENAME TO "Bookings";
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "no_of_guests" INTEGER NOT NULL,
    "hotelid" TEXT NOT NULL,
    CONSTRAINT "Room_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("hotelid", "id", "name") SELECT "hotelid", "id", "name" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
