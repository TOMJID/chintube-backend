import { zodValidator } from "@middleware/zodValidator";
import { verifyAdmin } from "@middleware/checkAuth";
import { Router } from "express";

import { mediaValidators } from "./media.validation";
import { mediaController } from "./media.controller";

const router = Router();

router.get("/", mediaController.listMedia);
router.get("/:id", mediaController.getMediaById);

router.post(
  "/create",
  verifyAdmin,
  zodValidator(mediaValidators.create),
  mediaController.createMedia,
);

export const MediaRoutes = router;
