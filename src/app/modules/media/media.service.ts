import { prisma } from "@lib/prisma";

const createMedia = async (data: any) => {
  const result = await prisma.media.create({
    data,
  });

  return result;
};

const listMedia = async ({ skip = 0, take = 10, filters = {} }: any) => {
  const where: any = {};
  const { q, genre, type, releaseYear } = filters || {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { synopsis: { contains: q, mode: "insensitive" } },
      { director: { contains: q, mode: "insensitive" } },
    ];
  }

  if (type) where.type = type;

  if (genre) {
    const genres = Array.isArray(genre)
      ? genre
      : typeof genre === "string"
        ? genre.split(",").map((g: string) => g.trim())
        : [];
    if (genres.length === 1) where.genre = { has: genres[0] };
    else if (genres.length > 1) where.genre = { hasSome: genres };
  }

  if (releaseYear) where.releaseYear = Number(releaseYear);

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.media.count({ where }),
  ]);

  const page = Math.floor(skip / take) + 1;

  return { items, total, page, limit: take };
};

export const mediaService = {
  createMedia,
  listMedia,
};
