import { sendResponse } from "@utils/sendResponse";
import { Request, Response } from "express";
import status from "http-status";

import { reviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return sendResponse(res, {
      httpStatusCode: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const payload = req.body;

  const result = await reviewService.createReview(user.id, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
};

export const reviewController = {
  createReview,
};
