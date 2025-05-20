/*
  Warnings:

  - Added the required column `amountpaid` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expireson" DATETIME NOT NULL,
    "userid" TEXT NOT NULL,
    "amountpaid" INTEGER NOT NULL,
    CONSTRAINT "Subscriptions_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Subscriptions" ("expireson", "id", "userid") SELECT "expireson", "id", "userid" FROM "Subscriptions";
DROP TABLE "Subscriptions";
ALTER TABLE "new_Subscriptions" RENAME TO "Subscriptions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
