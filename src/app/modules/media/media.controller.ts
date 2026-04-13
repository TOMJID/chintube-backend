import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createMedia = async (req: Request, res: Response) => {
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Media created successfully",
    data: null,
  });
};

export const mediaController = {
  createMedia,
};
