-- AlterTable
ALTER TABLE "user" ALTER COLUMN "firstname" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "twoFactor" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;
