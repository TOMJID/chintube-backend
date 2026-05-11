import { prisma } from "@lib/prisma";

const createMedia = async (data: any) => {
  const result = await prisma.media.create({
    data,
  });

  return result;
};

export const mediaService = {
  createMedia,
};
