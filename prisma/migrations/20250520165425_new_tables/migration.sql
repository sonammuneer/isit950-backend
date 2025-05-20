-- AlterTable
ALTER TABLE "User" ADD COLUMN "rating" INTEGER;

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expireson" DATETIME NOT NULL,
    "userid" TEXT NOT NULL,
    CONSTRAINT "Subscriptions_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoomBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    CONSTRAINT "RoomBlock_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
