import { Role } from "@orm/generated/prisma-client/enums";
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

const deleteComment = async (userId: string, id: string, userRole?: Role) => {
  const existing = await prisma.comment.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!existing) return null;

  if (userRole !== Role.ADMIN && existing.authorId !== userId) {
    throw new AppError(403, "Forbidden: you can only delete your own comment");
  }

  // Collect all descendant comment IDs (including the root)
  const toDelete: string[] = [id];
  for (let i = 0; i < toDelete.length; i++) {
    const cur = toDelete[i];
    const children = await prisma.comment.findMany({
      where: { parentId: cur },
      select: { id: true },
    });
    for (const c of children) toDelete.push(c.id);
  }

  // If the user is not admin, ensure none of the descendants are owned by other users
  if (userRole !== Role.ADMIN) {
    const descendants = await prisma.comment.findMany({
      where: { id: { in: toDelete } },
      select: { id: true, authorId: true },
    });

    const others = descendants.filter((d) => d.authorId !== userId);
    if (others.length > 0) {
      throw new AppError(
        403,
        "Forbidden: cannot delete comment because it has replies authored by other users",
      );
    }
  }

  try {
    await prisma.comment.deleteMany({ where: { id: { in: toDelete } } });
    return existing;
  } catch (error: any) {
    if (error?.code === "P2025") return null;
    throw error;
  }
};

export const commentService = {
  createComment,
  createReply,
  listComments,
  deleteComment,
};
