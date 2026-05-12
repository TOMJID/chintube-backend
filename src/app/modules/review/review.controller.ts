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

const listReviews = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const { mediaId, authorId, q, minRating, maxRating, isApproved } =
    req.query as any;

  const result = await reviewService.listReviews({
    skip,
    take: limit,
    filters: {
      mediaId: mediaId as string | undefined,
      authorId: authorId as string | undefined,
      q: q as string | undefined,
      minRating: minRating ? Number(minRating) : undefined,
      maxRating: maxRating ? Number(maxRating) : undefined,
      isApproved:
        isApproved === "true"
          ? true
          : isApproved === "false"
            ? false
            : undefined,
    },
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result.items,
    meta: result.meta,
  });
};

const getReviewById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await reviewService.getReviewById(id as string);

  if (!result) {
    return sendResponse(res, {
      httpStatusCode: status.NOT_FOUND,
      success: false,
      message: "Review not found",
    });
  }

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
};

const updateReview = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return sendResponse(res, {
      httpStatusCode: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const { id } = req.params;
  const payload = req.body;

  const result = await reviewService.updateReview(
    user.id,
    id as string,
    payload,
    user.role,
  );

  if (!result) {
    return sendResponse(res, {
      httpStatusCode: status.NOT_FOUND,
      success: false,
      message: "Review not found",
    });
  }

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
};

const deleteReview = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return sendResponse(res, {
      httpStatusCode: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const { id } = req.params;

  const result = await reviewService.deleteReview(
    user.id,
    id as string,
    user.role,
  );

  if (!result) {
    return sendResponse(res, {
      httpStatusCode: status.NOT_FOUND,
      success: false,
      message: "Review not found",
    });
  }

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
};

export const reviewController = {
  createReview,
  listReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
