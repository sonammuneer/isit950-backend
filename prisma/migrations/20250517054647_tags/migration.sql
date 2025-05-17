-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hotelid" TEXT NOT NULL,
    CONSTRAINT "Tags_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
