import { Genre } from "@orm/generated/prisma-client/enums";
import { prisma } from "@lib/prisma";

import { createMediaQueryBuilder } from "./query";

const createMedia = async (data: any) => {
  const result = await prisma.media.create({ data });
  return result;
};

const listMedia = async ({ skip = 0, take = 10, filters = {} }: any) => {
  // Map existing params to QueryBuilder-compatible params
  const { q, genre, type, releaseYear } = filters || {};

  const page = Math.floor(skip / take) + 1;

  const queryParams: Record<string, unknown> = {
    page: String(page),
    limit: String(take),
  };

  if (q) queryParams.searchTerm = q;

  if (type)
    queryParams.type =
      typeof type === "string" ? String(type).toUpperCase() : type;

  if (releaseYear) queryParams.releaseYear = String(releaseYear);

  if (genre) {
    const genres = Array.isArray(genre)
      ? genre
      : typeof genre === "string"
        ? genre.split(",").map((g: string) => g.trim())
        : [];

    const normalize = (s: string) =>
      s
        .toString()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
    const enumValues = Object.values(Genre);
    const normalizedMap: Record<string, string> = enumValues.reduce(
      (acc, val) => {
        acc[normalize(val)] = val;
        return acc;
      },
      {} as Record<string, string>,
    );

    const mappedGenres = genres
      .map((g: string) => normalizedMap[normalize(g)])
      .filter(Boolean) as string[];

    if (mappedGenres.length === 1) queryParams["genre(has)"] = mappedGenres[0];
    else if (mappedGenres.length > 1)
      queryParams["genre(hasSome)"] = mappedGenres;
  }

  const qb = createMediaQueryBuilder(queryParams as any);

  const results = await qb.search().filter().paginate().sort().execute();

  return results;
};

const getMediaById = async (id: string) => {
  const result = await prisma.media.findUnique({
    where: { id },
    include: { reviews: true, _count: true },
  });

  return result;
};

const updateMedia = async (id: string, data: any) => {
  try {
    const updated = await prisma.media.update({
      where: { id },
      data,
    });

    return updated;
  } catch (error: any) {
    // Prisma error P2025 = Record to update not found.
    if (error?.code === "P2025") return null;
    throw error;
  }
};

export const mediaService = {
  createMedia,
  listMedia,
  getMediaById,
  updateMedia,
};
