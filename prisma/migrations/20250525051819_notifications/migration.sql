-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "Notifications_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expireson" DATETIME NOT NULL,
    "userid" TEXT NOT NULL,
    "amountpaid" INTEGER,
    CONSTRAINT "Subscriptions_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Subscriptions" ("amountpaid", "expireson", "id", "userid") SELECT "amountpaid", "expireson", "id", "userid" FROM "Subscriptions";
DROP TABLE "Subscriptions";
ALTER TABLE "new_Subscriptions" RENAME TO "Subscriptions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
