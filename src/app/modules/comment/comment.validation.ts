import z from "zod";


export const CreateCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  reviewId: z.string().min(1, "reviewId is required"),
});

export const ReplyCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  reviewId: z.string().min(1, "reviewId is required"),
  parentId: z.string().min(1, "parentId is required"),
});

export const commentValidators = {
  create: CreateCommentSchema,
  reply: ReplyCommentSchema,
};
