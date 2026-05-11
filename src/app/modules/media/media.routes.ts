import { verifyAdmin } from "@middleware/checkAuth";
import { Router } from "express";

import { mediaController } from "./media.controller";

const router = Router();

router.post("/create", verifyAdmin, mediaController.createMedia);

export const MediaRoutes = router;
