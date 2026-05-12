import { sendResponse } from "@utils/sendResponse";
import { Request, Response } from "express";
import status from "http-status";

import { mediaService } from "./media.service";

const createMedia = async (req: Request, res: Response) => {
  const result = await mediaService.createMedia(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Media created successfully",
    data: result,
  });
};

const listMedia = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const { q, genre, type, releaseYear } = req.query as any;

  const result = await mediaService.listMedia({
    skip,
    take: limit,
    filters: {
      q: typeof q === "string" ? q : undefined,
      genre: typeof genre === "string" ? genre : undefined,
      type: typeof type === "string" ? type : undefined,
      releaseYear: releaseYear ? Number(releaseYear) : undefined,
    },
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Media list retrieved successfully",
    data: result,
  });
};

export const mediaController = {
  createMedia,
  listMedia,
};
