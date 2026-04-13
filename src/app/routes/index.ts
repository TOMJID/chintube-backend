import { Router } from "express";
import { MediaRoutes } from "../modules/media/media.routes";

const router = Router();

router.use("/media", MediaRoutes);

export const RoutesIndex = router;
