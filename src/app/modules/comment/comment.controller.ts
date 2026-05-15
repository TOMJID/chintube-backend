import { sendResponse } from "@utils/sendResponse";
import { Request, Response } from "express";
import status from "http-status";

import { commentService } from "./comment.service";


const createMainComment = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return sendResponse(res, {
      httpStatusCode: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const payload = req.body;
  // Ensure parentId is not provided for main comments
  if (Object.prototype.hasOwnProperty.call(payload, "parentId")) {
    return sendResponse(res, {
      httpStatusCode: status.BAD_REQUEST,
      success: false,
      message:
        "Use the reply endpoint to create replies (do not provide parentId here)",
    });
  }

  const result = await commentService.createComment(user.id, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Comment created successfully",
    data: result,
  });
};

const replyComment = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return sendResponse(res, {
      httpStatusCode: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
    });
  }

  const payload = req.body;

  const result = await commentService.createReply(user.id, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Reply created successfully",
    data: result,
  });
};

const listComments = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const { reviewId } = req.params as any;

  const result = await commentService.listComments({
    reviewId: reviewId as string | undefined,
    skip,
    take: limit,
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: result.items,
    meta: result.meta,
  });
};

export const commentController = {
  createMainComment,
  replyComment,
  listComments,
};
