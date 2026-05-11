import { verifyAdmin } from "@middleware/checkAuth.middleware";
import { Router } from "express";

import { mediaController } from "./media.controller";

const router = Router();

router.post("/create", verifyAdmin, mediaController.createMedia);

export const MediaRoutes = router;
