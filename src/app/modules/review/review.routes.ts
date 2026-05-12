import authCheck, { verifyUser } from "@middleware/checkAuth";
import { zodValidator } from "@middleware/zodValidator";
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

router.get("/", reviewController.listReviews);
router.get("/:id", reviewController.getReviewById);
router.patch(
  "/:id",
  authCheck(),
  zodValidator(reviewValidators.update),
  reviewController.updateReview,
);
router.delete("/:id", authCheck(), reviewController.deleteReview);

export const ReviewRoutes = router;
