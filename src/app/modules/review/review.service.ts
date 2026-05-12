import { Role } from "@orm/generated/prisma-client/enums";
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

const listReviews = async ({ skip = 0, take = 10, filters = {} }: any) => {
  const { mediaId, authorId, q, minRating, maxRating, isApproved } =
    filters || {};

  const where: any = {};

  if (mediaId) where.mediaId = mediaId;
  if (authorId) where.authorId = authorId;
  if (typeof isApproved === "boolean") where.isApproved = isApproved;

  if (minRating || maxRating) {
    where.rating = {};
    if (minRating) where.rating.gte = Number(minRating);
    if (maxRating) where.rating.lte = Number(maxRating);
  }

  if (q) {
    where.content = { contains: String(q), mode: "insensitive" };
  }

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        media: true,
        _count: { select: { comments: true, likes: true } },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    items,
    meta: {
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take) || 1,
    },
  };
};

const getReviewById = async (id: string) => {
  const result = await prisma.review.findUnique({
    where: { id },
    include: {
      author: true,
      media: true,
      comments: { orderBy: { createdAt: "desc" } },
      likes: true,
      _count: { select: { comments: true, likes: true } },
    },
  });

  return result;
};

const updateReview = async (
  userId: string,
  id: string,
  data: any,
  userRole?: Role,
) => {
  const existing = await prisma.review.findUnique({ where: { id } });

  if (!existing) return null;

  // Only author or admin can update
  if (userRole !== Role.ADMIN && existing.authorId !== userId) {
    throw new AppError(403, "Forbidden: you can only update your own review");
  }

  const allowedFields = ["rating", "content", "tags", "hasSpoilers"];
  const updateData: any = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      updateData[field] = data[field];
    }
  }

  if (Object.prototype.hasOwnProperty.call(data, "isApproved")) {
    if (userRole !== Role.ADMIN) {
      throw new AppError(403, "Forbidden: only admins can set isApproved");
    }
    updateData.isApproved = !!data.isApproved;
  }

  if (Object.keys(updateData).length === 0) return existing;

  try {
    const updated = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        media: true,
        _count: { select: { comments: true, likes: true } },
      },
    });

    return updated;
  } catch (error: any) {
    if (error?.code === "P2025") return null;
    throw error;
  }
};

const deleteReview = async (userId: string, id: string, userRole?: Role) => {
  const existing = await prisma.review.findUnique({ where: { id } });

  if (!existing) return null;

  if (userRole !== Role.ADMIN && existing.authorId !== userId) {
    throw new AppError(403, "Forbidden: you can only delete your own review");
  }

  try {
    const deleted = await prisma.review.delete({
      where: { id },
      include: {
        author: true,
        media: true,
        _count: { select: { comments: true, likes: true } },
      },
    });

    return deleted;
  } catch (error: any) {
    if (error?.code === "P2025") return null;
    throw error;
  }
};

export const reviewService = {
  createReview,
  listReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
