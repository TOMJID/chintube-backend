import { prisma } from "@lib/prisma";

import AppError from "../../errorHelper/AppError";

const createReview = async (userId: string, payload: any) => {
  const { mediaId, rating, content, tags, hasSpoilers } = payload;

  // Ensure media exists
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) {
    throw new AppError(404, "Media not found");
  }

  // Enforce one review per user per media
  const existing = await prisma.review.findUnique({
    where: { authorId_mediaId: { authorId: userId, mediaId } },
  });

  if (existing) {
    throw new AppError(409, "You have already reviewed this media");
  }

  const result = await prisma.review.create({
    data: {
      rating,
      content,
      tags,
      hasSpoilers,
      author: { connect: { id: userId } },
      media: { connect: { id: mediaId } },
    },
    include: { author: true, media: true },
  });

  return result;
};

export const reviewService = {
  createReview,
};
