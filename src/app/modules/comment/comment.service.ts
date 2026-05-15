import { prisma } from "@lib/prisma";

import AppError from "../../errorHelper/AppError";


const createComment = async (userId: string, payload: any) => {
  const { content, reviewId, parentId } = payload;

  // Ensure review exists
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError(404, "Review not found");
  }

  // If replying to a parent comment, validate it exists and belongs to the same review
  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent) {
      throw new AppError(404, "Parent comment not found");
    }
    if (parent.reviewId !== reviewId) {
      throw new AppError(
        400,
        "Parent comment does not belong to the same review",
      );
    }
  }

  const result = await prisma.comment.create({
    data: {
      content,
      author: { connect: { id: userId } },
      review: { connect: { id: reviewId } },
      parent: parentId ? { connect: { id: parentId } } : undefined,
    },
    include: {
      author: true,
      replies: true,
    },
  });

  return result;
};

const createReply = async (userId: string, payload: any) => {
  const { parentId } = payload;

  if (!parentId) {
    throw new AppError(400, "parentId is required for replies");
  }

  return createComment(userId, payload);
};

const listComments = async ({ reviewId, skip = 0, take = 10 }: any) => {
  if (!reviewId) {
    throw new AppError(400, "reviewId is required");
  }

  const where: any = { reviewId, parentId: null };

  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        replies: {
          orderBy: { createdAt: "asc" },
          include: { author: true },
        },
      },
    }),
    prisma.comment.count({ where }),
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

export const commentService = {
  createComment,
  createReply,
  listComments,
};
