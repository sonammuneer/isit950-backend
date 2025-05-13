-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hotelid" TEXT NOT NULL,
    CONSTRAINT "Room_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");
