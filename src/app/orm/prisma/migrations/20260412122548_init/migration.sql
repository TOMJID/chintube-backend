-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'SERIES');

-- CreateEnum
CREATE TYPE "PriceTier" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'RENT', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
