-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "token" TEXT,
    "twoFactor" BOOLEAN NOT NULL,
    "role" TEXT NOT NULL,
    "registerToken" TEXT,
    "editEmail" TEXT,
    "meetingId" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_mail_key" ON "user"("mail");
