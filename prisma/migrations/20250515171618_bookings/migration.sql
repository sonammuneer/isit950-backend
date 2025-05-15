-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" TEXT;

-- CreateTable
CREATE TABLE "Bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomid" TEXT NOT NULL,
    "startdate" DATETIME NOT NULL,
    "enddate" DATETIME NOT NULL,
    "bookinguserid" TEXT NOT NULL,
    "hotelid" TEXT NOT NULL,
    CONSTRAINT "Bookings_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
