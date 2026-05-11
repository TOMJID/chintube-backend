-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('ACTION', 'ADVENTURE', 'ANIMATION', 'COMEDY', 'CRIME', 'DOCUMENTARY', 'DRAMA', 'FAMILY', 'FANTASY', 'HORROR', 'MYSTERY', 'ROMANCE', 'SCI_FI', 'THRILLER', 'WAR', 'WESTERN', 'K_DRAMA', 'ANIME');

-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('CLASSIC', 'MUST_WATCH', 'UNDERRATED', 'FAMILY_FRIENDLY', 'SPOILER', 'TRENDING', 'CRITIC_CHOICE', 'HIDDEN_GEM', 'FEEL_GOOD', 'INTENSE');

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "synopsis" TEXT NOT NULL,
    "genre" "Genre"[],
    "releaseYear" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT[],
    "streamingUrl" TEXT NOT NULL,
    "priceTier" "PriceTier" NOT NULL DEFAULT 'FREE',
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "tags" "Tag"[],
    "hasSpoilers" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_authorId_mediaId_key" ON "Review"("authorId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_reviewId_key" ON "Like"("userId", "reviewId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
