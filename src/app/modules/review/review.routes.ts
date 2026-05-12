import { zodValidator } from "@middleware/zodValidator";
import { verifyUser } from "@middleware/checkAuth";
import { Router } from "express";

import { reviewValidators } from "./review.validation";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
  "/create",
  verifyUser,
  zodValidator(reviewValidators.create),
  reviewController.createReview,
);

export const ReviewRoutes = router;
