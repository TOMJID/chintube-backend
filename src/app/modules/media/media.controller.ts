import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import {
  listMedia,
  parseOptionalNumber,
  validateMediaPayload,
} from "./media.service";

const normalizePage = (
  value: unknown,
  fallback: number,
  min = 1,
  max?: number,
) => {
  const parsed = parseOptionalNumber(value);
  const safeValue = Math.max(parsed ?? fallback, min);

  return max ? Math.min(safeValue, max) : safeValue;
};

const createMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { errors, data } = validateMediaPayload(req.body, true);

    if (errors.length) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid media payload",
        errors,
      });
      return;
    }

    const media = await createMedia(data);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Media created successfully",
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

const getMediaList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sort = req.query.sort === "popular" ? "popular" : "latest";
    const result = await listMedia({
      search:
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined,
      genre:
        typeof req.query.genre === "string"
          ? req.query.genre.trim()
          : undefined,
      year: parseOptionalNumber(req.query.year),
      page: normalizePage(req.query.page, 1),
      limit: normalizePage(req.query.limit, 12, 1, 50),
      sort,
    });

    res.status(httpStatus.OK).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

const getMediaById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mediaId = String(req.params.id);
    const media = await getMediaById(mediaId);

    if (!media) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Media not found",
      });
      return;
    }

    res.status(httpStatus.OK).json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

const updateMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { errors, data } = validateMediaPayload(req.body, false);

    if (errors.length) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid media payload",
        errors,
      });
      return;
    }

    const mediaId = String(req.params.id);
    const updatedMedia = await updateMedia(mediaId, data);

    if (!updatedMedia) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Media not found",
      });
      return;
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "Media updated successfully",
      data: updatedMedia,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mediaId = String(req.params.id);
    const deleted = await deleteMedia(mediaId);

    if (!deleted) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Media not found",
      });
      return;
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const mediaController = {
  createMedia,
  getMediaList,
  getMediaById,
  updateMedia,
  deleteMedia,
};
