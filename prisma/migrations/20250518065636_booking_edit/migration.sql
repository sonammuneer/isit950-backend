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
    CONSTRAINT "Bookings_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bookings_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bookings" ("booking_count", "bookinguserid", "enddate", "hotelid", "id", "no_of_guests", "roomid", "startdate") SELECT "booking_count", "bookinguserid", "enddate", "hotelid", "id", "no_of_guests", "roomid", "startdate" FROM "Bookings";
DROP TABLE "Bookings";
ALTER TABLE "new_Bookings" RENAME TO "Bookings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
