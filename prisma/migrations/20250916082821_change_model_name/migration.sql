/*
  Warnings:

  - You are about to drop the `signUp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."signUp";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
