import z from "zod";


export const CreateCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  reviewId: z.string().min(1, "reviewId is required"),
  parentId: z.string().optional(),
});

export const commentValidators = {
  create: CreateCommentSchema,
};
