import { Router } from "express";

import { CommentRoutes } from "../modules/comment/comment.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { MediaRoutes } from "../modules/media/media.routes";


const router = Router();

router.use("/media", MediaRoutes);
router.use("/review", ReviewRoutes);
router.use("/comment", CommentRoutes);

export const RoutesIndex = router;
