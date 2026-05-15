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

export const commentService = {
  createComment,
  createReply,
};
