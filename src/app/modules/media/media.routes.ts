import { Router } from "express";
import { mediaController } from "./media.controller";
import { verifyAdmin } from "../../middleware/checkAuth.middleware";

const router = Router();

router.post("/create", verifyAdmin, mediaController.createMedia);

export const MediaRoutes = router;
