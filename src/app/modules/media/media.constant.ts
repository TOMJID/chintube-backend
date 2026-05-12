import { Prisma } from "@orm/generated/prisma-client/client";

export const mediaSearchableFields = ["title", "synopsis", "director"];

export const mediaFilterableFields = ["type", "genre", "releaseYear"];

export const mediaIncludeConfig: Partial<
  Record<
    keyof Prisma.MediaInclude,
    Prisma.MediaInclude[keyof Prisma.MediaInclude]
  >
> = {
  reviews: true,
};

export default mediaIncludeConfig;
