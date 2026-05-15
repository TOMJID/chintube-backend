import { zodValidator } from "@middleware/zodValidator";
import authCheck from "@middleware/checkAuth";
import { Router } from "express";

import { commentValidators } from "./comment.validation";
import { commentController } from "./comment.controller";


const router = Router();

// List comments for a review (top-level comments with replies)
router.get("/:reviewId", commentController.listComments);

// Create a top-level comment (no parentId)
router.post(
  "/create",
  authCheck(),
  zodValidator(commentValidators.create),
  commentController.createMainComment,
);

// Reply to an existing comment
router.post(
  "/reply",
  authCheck(),
  zodValidator(commentValidators.reply),
  commentController.replyComment,
);

export const CommentRoutes = router;
