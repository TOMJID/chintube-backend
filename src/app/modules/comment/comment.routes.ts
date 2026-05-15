import { zodValidator } from "@middleware/zodValidator";
import { verifyUser } from "@middleware/checkAuth";
import { Router } from "express";

import { commentValidators } from "./comment.validation";
import { commentController } from "./comment.controller";


const router = Router();

router.post(
  "/create",
  verifyUser,
  zodValidator(commentValidators.create),
  commentController.createComment,
);

export const CommentRoutes = router;
