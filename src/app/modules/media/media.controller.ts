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

export const mediaController = {
  createMedia,
};
