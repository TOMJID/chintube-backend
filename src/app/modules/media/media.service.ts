import { prisma } from "@lib/prisma";

const createMedia = async () => {
  const result = await prisma.media.create({
    data: {
      title: "Sample Media",
      type: "MOVIE",
      synopsis: "Sample synopsis",
      releaseYear: 2024,
      director: "Sample Director",
      streamingUrl:
        "https://www.youtube.com/watch?v=ewvddSUEONQ&list=RDlbCRtrrMvSw&index=2",
    },
  });

  return result;
};

export const mediaService = {
  createMedia,
};
