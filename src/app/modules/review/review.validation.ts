import { Tag } from "@orm/generated/prisma-client/enums";
import z from "zod";

export const ZodTag = z.enum(Tag);

export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be between 1 and 10").max(10),
  content: z.string().min(1, "Content is required"),
  tags: z.array(ZodTag).optional(),
  hasSpoilers: z.boolean().optional(),
  mediaId: z.string().min(1, "mediaId is required"),
});

export const reviewValidators = {
  create: CreateReviewSchema,
};
