import {
  Genre,
  MediaType,
  PriceTier,
} from "@orm/generated/prisma-client/enums";
import z from "zod";

// Wrap Prisma-generated enums with Zod validators
export const ZodGenre = z.enum(Genre);
export const ZodMediaType = z.enum(MediaType);
export const ZodPriceTier = z.enum(PriceTier);

// Media schemas
export const CreateMediaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: ZodMediaType,
  synopsis: z.string().min(1, "Synopsis is required"),
  genre: z.array(ZodGenre).min(1, "At least one genre is required"),
  releaseYear: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear() + 1),
  director: z.string().min(1, "Director is required"),
  cast: z.array(z.string()).min(1, "At least one cast member is required"),
  streamingUrl: z.url("Invalid streaming URL"),
  priceTier: ZodPriceTier.optional(),
  price: z.number().positive().optional(),
});

// Export commonly used validators for route middleware
export const mediaValidators = {
  create: CreateMediaSchema,
};
