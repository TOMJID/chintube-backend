import { Router } from "express";

import { MediaRoutes } from "../modules/media/media.routes";
import { ReviewRoutes } from "../modules/review/review.routes";

const router = Router();

router.use("/media", MediaRoutes);
router.use("/review", ReviewRoutes);

export const RoutesIndex = router;
