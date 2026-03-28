-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "IsActive" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('google', 'credentials');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "picture" TEXT,
    "address" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" "IsActive" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
