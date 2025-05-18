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
    CONSTRAINT "Bookings_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bookings_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Bookings" ("booking_count", "bookinguserid", "enddate", "hotelid", "id", "no_of_guests", "roomid", "startdate") SELECT "booking_count", "bookinguserid", "enddate", "hotelid", "id", "no_of_guests", "roomid", "startdate" FROM "Bookings";
DROP TABLE "Bookings";
ALTER TABLE "new_Bookings" RENAME TO "Bookings";
CREATE TABLE "new_Favourites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userid" TEXT NOT NULL,
    "hotelid" TEXT NOT NULL,
    CONSTRAINT "Favourites_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Favourites" ("hotelid", "id", "userid") SELECT "hotelid", "id", "userid" FROM "Favourites";
DROP TABLE "Favourites";
ALTER TABLE "new_Favourites" RENAME TO "Favourites";
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotelid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userid" TEXT NOT NULL,
    CONSTRAINT "Review_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("description", "hotelid", "id", "rating", "userid") SELECT "description", "hotelid", "id", "rating", "userid" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "no_of_guests" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "hotelid" TEXT NOT NULL,
    CONSTRAINT "Room_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("count", "hotelid", "id", "name", "no_of_guests", "price") SELECT "count", "hotelid", "id", "name", "no_of_guests", "price" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");
CREATE TABLE "new_Tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hotelid" TEXT NOT NULL,
    CONSTRAINT "Tags_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tags" ("hotelid", "id", "name") SELECT "hotelid", "id", "name" FROM "Tags";
DROP TABLE "Tags";
ALTER TABLE "new_Tags" RENAME TO "Tags";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
